/**
 * Main entry point for the Game Server
 */

import { GameServer } from './core/GameServer';

const DEFAULT_PORT = 8080;
const port = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

const server = new GameServer({
  port,
  host: '0.0.0.0',
  tickRate: 30
});

server.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  server.stop();
  process.exit(0);
});

// Log stats periodically
setInterval(() => {
  const stats = server.getStats();
  console.log('Server stats:', stats);
}, 30000); // Every 30 seconds
