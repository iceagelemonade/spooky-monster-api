#!/bin/bash

API="http://localhost:8000"
URL_PATH="/monsters"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "monster": {
      "name": "'"${NAME}"'",
      "type": "'"${TYPE}"'",
      "funFacts": "'"${FUNFACTS}"'"
    }
  }'

echo
