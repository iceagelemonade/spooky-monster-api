// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const monster = require('../models/monster')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Index -- GET
//  /monsters
router.get('/monsters', requireToken, (req, res, next) => {
  monster.find()
    .then(monsters => {
      return monsters.map(monster => monster)
    })
    .then(monsters => {
      res.status(200).json({ monsters: monsters })
    })
    .catch(next)
})

// Show -- GET
// /monsters/:id
router.get('/monsters/:id', requireToken, (req, res, next) => {
  monster.findById(req.params.id)
    .then(handle404)
    .then(monster => {
      res.status(200).json({ monster: monster })
    })
    .catch(next)
})

// Create -- PUT
// /monster
router.post('/monsters',requireToken, (req, res, next) => {
    req.body.monster.owner = req.user.id

    // on the front-end I HAVE TO SEND a monster as the top level key
    monster.create(req.body.monster)
        .then((monster) => {
            res.status(201).json({ monster: monster })
        })
        .catch(next)
})

// Update -- PATCH
// /monsters/:id
router.patch('/monsters/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.monster.owner

  monster.findById(req.params.id)
    .then(handle404)
    .then(monster => {
      requireOwnership(req, monster)
      return monster.updateOne(req.body.monster)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// Destroy -- DELETE
//  /monsters/:id
router.delete('/monsters/:id', requireToken, (req, res, next) => {
  monster.findById(req.params.id)
    .then(handle404)
    .then(monster => {
      requireOwnership(req, monster)
      monster.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router