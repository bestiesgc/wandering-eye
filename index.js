import { handler as frontend } from './frontend/build/handler.js';
import backend from './backend/server.js';
import express from 'express';

const app = express();

app.use(backend);

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(frontend);

app.listen(8998, "127.0.0.1", () => {
  console.log('listening on port 8998 on 127.0.0.1');
});