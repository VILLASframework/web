#cleanup cpk
set -e
kill $(ps aux | grep cloud-provider-kind | grep -v grep | awk '{print $2}')
kind delete cluster --name test-cluster
docker compose -f front-tests.yaml down -v
