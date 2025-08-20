kind create cluster --name test-cluster
kind export kubeconfig --name test-cluster --internal --kubeconfig ./kubeconfig
sudo nohup cloud-provider-kind &


#PREPARE FOR CONTROLLER
docker exec test-cluster-control-plane sh -c 'kubectl create ns villas-controller'
docker compose up -f front-tests.yaml