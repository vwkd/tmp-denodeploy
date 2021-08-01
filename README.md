Quotes API

GET /quote
accept: application/json
200 if successful
406 if wrong accept

POST /quote
{quote: string, author: string}
content-type: application/json
accept: application/json
201 if successful
415 if other content-type
406 if other accept

404 if other path
405 if other method