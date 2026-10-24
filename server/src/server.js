import app from './app.js';
import { config } from './config/index.js';
import { runSeeds } from './db/seed.js';

// Start Server locally after verifying database
async function startServer() {
  try {
    await runSeeds();
    
    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚕 Papido Booking Opinion Survey API Server`);
      console.log(`📡 Running on: http://localhost:${config.port}`);
      console.log(`🌐 Allowed Client: ${config.clientUrl}`);
      console.log(`🔒 Database: TiDB Cloud Serverless (SSL enabled)`);
      console.log(`🔒 Environment: ${config.nodeEnv}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[ServerStart] Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
