import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

const projectRoot = process.cwd();
loadEnvConfig(projectRoot);

const configuredPort = Number.parseInt(process.env.PORT ?? '3000', 10);
if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  console.error(`Invalid PORT value: ${process.env.PORT}`);
  process.exit(1);
}

function isPortAvailable(port) {
  return new Promise((resolveAvailability, reject) => {
    const server = createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') resolveAvailability(false);
      else reject(error);
    });
    server.listen({ host: '127.0.0.1', port, exclusive: true }, () => {
      server.close((error) => error ? reject(error) : resolveAvailability(true));
    });
  });
}

let port = configuredPort;
while (port <= 65535 && !(await isPortAvailable(port))) port += 1;

if (port > 65535) {
  console.error(`No available port found at or above ${configuredPort}.`);
  process.exit(1);
}

if (port !== configuredPort) {
  console.log(`Port ${configuredPort} is already in use; using ${port}.`);
}

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');
const next = spawn(process.execPath, [nextBin, 'dev', '--port', String(port)], {
  cwd: projectRoot,
  env: { ...process.env, PORT: String(port) },
  stdio: 'inherit',
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => next.kill(signal));
}

next.once('error', (error) => {
  console.error('Could not start Next.js:', error.message);
  process.exitCode = 1;
});
next.once('exit', (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
