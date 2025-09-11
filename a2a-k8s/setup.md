
# install kind
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.30.0/kind-linux-amd64

chmod +x ./kind

and move it to somewhere in your PATH

in my case:
/home/ns/.local/bin/kind

# build images
docker build -t a2a/worker-echo:local ./worker-echo
docker build -t a2a/worker-math:local ./worker-math
docker build -t a2a/coordinator:local ./coordinator
docker build -t a2a/webapp:local ./webapp

