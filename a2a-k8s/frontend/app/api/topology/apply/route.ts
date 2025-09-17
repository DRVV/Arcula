import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';

export const runtime = 'nodejs';

function truthyEnv(v: string | undefined) {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return !(s === '0' || s === 'false' || s === 'off' || s === '');
}

type RunResult = { code: number; stdout: string; stderr: string };

function runBashScript(
  scriptPath: string,
  opts?: { cwd?: string; env?: NodeJS.ProcessEnv }
): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = spawn('bash', [scriptPath], {
      cwd: opts?.cwd,
      env: opts?.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    child.on('error', (err) => {
      resolve({ code: 1, stdout, stderr: `${stderr}\n${String(err)}`.trim() });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Accept arbitrary payload but Option A does not use it directly now.
    const payload = await req.json().catch(() => null);

    const useLocal = truthyEnv(process.env.USE_LOCAL_APPLY);

    if (useLocal) {
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
          { error: 'local apply is disabled outside development' },
          { status: 403 }
        );
      }

      // Run k8s/apply.sh from the repo root so relative paths resolve.
      const repoRoot = path.resolve(process.cwd(), '..');
      const k8sDir = path.join(repoRoot, 'k8s');
      const scriptPath = path.join(k8sDir, 'apply.sh');

      const result = await runBashScript(scriptPath, {
        cwd: k8sDir,
        env: { ...process.env, NO_WATCH: '1' }, // prevent long watch
      });

      const ok = result.code === 0;
      return NextResponse.json(
        {
          ok,
          exitCode: result.code,
          stdout: result.stdout,
          stderr: result.stderr,
          // echo payload just for transparency in dev
          payloadEchoed: payload ?? undefined,
        },
        { status: ok ? 200 : 500 }
      );
    }

    // Fallback: proxy to upstream APPLY_ENDPOINT (original behavior)
    const url = process.env.APPLY_ENDPOINT;

    if (url) {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload ?? {}),
        cache: 'no-store',
      });

      if (!r.ok) {
        const text = await r.text();
        return NextResponse.json(
          { error: `upstream ${r.status}: ${text}` },
          { status: 502 }
        );
      }

      // try to parse json, but if upstream returns no JSON just return ok
      const data = await r
        .json()
        .catch(async () => ({ ok: true, status: r.status }));
      return NextResponse.json(data);
    }

    // Fallback mock when APPLY_ENDPOINT is not configured and USE_LOCAL_APPLY is off
    return NextResponse.json({ ok: true, echoed: payload });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'failed' },
      { status: 500 }
    );
  }
}
