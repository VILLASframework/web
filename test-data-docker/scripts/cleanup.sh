#cleanup cpk
export test_dir=$(realpath "$0"|sed 's/scripts\/cleanup.sh//g')
kill $(ps aux | grep cloud-provider-kind | grep -v grep | awk '{print $2}')
set -e
kind delete cluster --name test-cluster
docker compose -f $test_dir'compose.yaml' down -v