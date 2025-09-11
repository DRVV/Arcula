# send a tiny task through the webapp → coordinator → workers
curl -s -X POST localhost:8080/task -H 'content-type: application/json' \
  -d '{"text":"add 2 4"}' | jq .
