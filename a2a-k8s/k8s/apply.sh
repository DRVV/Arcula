kubectl apply -f 00-namespace.yaml
kubectl apply -f 10-worker-echo.yaml
kubectl apply -f 11-worker-math.yaml
kubectl apply -f 20-coordinator.yaml
kubectl apply -f 30-webapp.yaml
kubectl -n a2a-demo get pods -w