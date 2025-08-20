kind create cluster --name test-cluster
kind export kubeconfig --name test-cluster --internal --kubeconfig ./kubeconfig
nohup cloud-provider-kind &


#PREPARE FOR CONTROLLER
docker exec test-cluster-control-plane sh -c 'kubectl create ns villas-controller'
docker compose -f front-tests.yaml up

#CLEANUP ONCE COMPOSE STOPS
# rm kubeconfig nohup.out