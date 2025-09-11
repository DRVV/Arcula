Minimal Next.js frontend for A2A agents

What it does
- Renders agent graph (Coordinator → Echo, Math) via React Flow
- Shows simple per-agent task status for the last chat
- Provides a chat box to send a message to the Coordinator

How to run
1) cd frontend
2) Copy .env.local.example to .env.local and set TASK_ENDPOINT (e.g., http://localhost:8080/task when using k8s port-forward)
3) npm install
4) npm run dev

Environment
- TASK_ENDPOINT: Full URL to webapp `/task`, e.g. http://localhost:8080/task (via kubectl port-forward) or http://webapp:8000/task (in-cluster)

Notes
- Status is derived by parsing the Coordinator's combined response embedded in the JSON-RPC result returned by the webapp `/task`: "[echo] ... | [math] ...".
- Error handling is kept minimal on purpose for quick iteration.
