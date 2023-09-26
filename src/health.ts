import {createServer, IncomingMessage, Server, ServerResponse} from "http"
import env from "./env";

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('healthy');
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
