#!/usr/bin/env bash
set -euo pipefail

# Rebuild images, load into kind, and restart deployments.
# Assumes: kind cluster named "a2a", namespace "a2a-demo" exists.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NS="a2a-demo"
KIND_NAME="a2a"

echo "[1/4] Building images..."
bash "$ROOT_DIR/k8s/build.sh"

echo "[2/4] Loading images into kind cluster '$KIND_NAME'..."
bash "$ROOT_DIR/k8s/load.sh"

echo "[3/4] Restarting deployments in namespace '$NS'..."
kubectl -n "$NS" rollout restart deploy/worker-echo || true
kubectl -n "$NS" rollout restart deploy/worker-math || true
kubectl -n "$NS" rollout restart deploy/coordinator || true
kubectl -n "$NS" rollout restart deploy/webapp || true

echo "[4/4] Waiting for rollouts to complete..."
kubectl -n "$NS" rollout status deploy/worker-echo --timeout=60s || true
kubectl -n "$NS" rollout status deploy/worker-math --timeout=60s || true
kubectl -n "$NS" rollout status deploy/coordinator --timeout=60s || true
kubectl -n "$NS" rollout status deploy/webapp --timeout=60s || true

echo "Done. You can now port-forward with: k8s/forward.sh"

