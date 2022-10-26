const mongoose = require('mongoose')

const monsterSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
      default: 'UNKNOWN'
		},
    funFacts: String,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
      default: 'There is nothing fun about this monster...'
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Monster', monsterSchema)
