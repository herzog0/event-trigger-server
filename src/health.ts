import {createServer, IncomingMessage, Server, ServerResponse} from "http"
import client from "./db";
import env from "./env";

async function isConnected(): Promise<boolean> {
  try {
    await client.query('SELECT * FROM audit.event_queue LIMIT 1;');
    return true;
  } catch (error) {
    return false;
  }
}

const server: Server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/health') {
    const hasDbConnection = await isConnected()
    res.writeHead(hasDbConnection ? 200 : 500, {'Content-Type': 'text/plain'});
    res.end(hasDbConnection ? 'healthy' : 'unhealthy');
    if (!hasDbConnection) {
      process.exit(1)
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(env.HEALTH_CHECK_PORT, () => {
  console.log(`Server listening on port ${env.HEALTH_CHECK_PORT}`);
});

server.on('error', (err: Error) => {
  console.error('Server error:', err.message);
});
