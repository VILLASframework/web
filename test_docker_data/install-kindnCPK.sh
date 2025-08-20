apt update
apt install wget
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64
chmod +x ./kind
mv ./kind /usr/local/bin/kind
wget https://github.com/kubernetes-sigs/cloud-provider-kind/releases/download/v0.7.0/cloud-provider-kind_0.7.0_linux_amd64.tar.gz -c
tar -xzvf cloud-provider-kind_0.7.0_linux_amd64.tar.gz
chmod +x ./cloud-provider-kind
mv ./cloud-provider-kind /usr/local/bin/cloud-provider-kind
