// Cross-platform single-command dev runner for DYD26 with hot-reload
const { spawn } = require('child_process');

console.log('\n======================================================');
console.log('🚀 Launching DYD26 Full-Stack Development Environment');
console.log('🌐 Web Address: http://localhost:5173');
console.log('⚡ API Address: http://localhost:3000');
console.log('======================================================\n');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start local Express backend server with hot-reload (port 3000)
const api = spawn(npxCmd, ['tsx', 'watch', 'local-server.ts'], { stdio: 'inherit', shell: isWin });

// 2. Start Vite React frontend server with HMR (port 5173)
const frontend = spawn(npmCmd, ['run', 'dev', '--prefix', 'frontend'], { stdio: 'inherit', shell: isWin });

const cleanExit = () => {
  console.log('\n🛑 Shutting down both servers...');
  try {
    api.kill();
    frontend.kill();
  } catch {}
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
