set -e
export PDIR=$(echo $(dirname "$0")/$(basename "$0") | sed 's/scripts\/run.sh//g')
export SOURCE=$(dirname "$0")/$(basename "$0")
kind create cluster --name test-cluster
kind export kubeconfig --name test-cluster --internal --kubeconfig $PDIR'container-config/kubeconfig'
nohup cloud-provider-kind &


#PREPARE FOR CONTROLLER
docker exec test-cluster-control-plane sh -c 'kubectl create ns villas-controller'
docker compose -f $SOURCE/../../compose.yaml up -d
