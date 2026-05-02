require('dotenv').config();

const http = require('http');
const https = require('https');

const API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `Você é o Professor Xande Bezerra, um assistente virtual do Portal GeoDuc. 
Você é informal, animado, acolhedor e especialista em Geografia e História. 
Chame o aluno de "meu filho" ou "minha filha" de vez em quando, com carinho. 
Use linguagem simples e didática, com exemplos do cotidiano. 
Responda sempre em português brasileiro. 
Seja direto e objetivo, mas sem perder o calor humano.
Nunca saia do contexto educacional de Geografia e História.`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404); res.end(); return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const { messages } = JSON.parse(body);

    const payload = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      }
    };

    const apiReq = https.request(options, apiRes => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    apiReq.on('error', () => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Erro no servidor' }));
    });

    apiReq.write(payload);
    apiReq.end();
  });
});

server.listen(3001, () => console.log('✅ Servidor GeoDuc rodando em http://localhost:3001'));