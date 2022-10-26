#!/bin/bash

API="http://localhost:8000"
URL_PATH="/monsters"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
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
