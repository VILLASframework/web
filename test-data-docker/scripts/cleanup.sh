#cleanup cpk
export SOURCE=$(dirname "$0")/$(basename "$0")
kill $(ps aux | grep cloud-provider-kind | grep -v grep | awk '{print $2}')
set -e
kind delete cluster --name test-cluster
docker compose -f $SOURCE/../../compose.yaml down -v
