set -e
export test_dir=$(realpath "$0"|sed 's/scripts\/run.sh//g')
kind create cluster --name test-cluster
kind export kubeconfig --name test-cluster --internal --kubeconfig $test_dir'container-config/kubeconfig'
nohup cloud-provider-kind &


#PREPARE FOR CONTROLLER
docker exec test-cluster-control-plane sh -c 'kubectl create ns villas-controller'
docker compose -f $test_dir'compose.yaml' up -d
