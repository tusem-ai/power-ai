const http = require('http');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Power AI Chatbot çalışıyor: http://localhost:${PORT}`);
});
const rootDir = __dirname;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const server = http.createServer(async (req, res) => {

  // ==========================================
  // CHAT API
  // ==========================================

  if (req.url === '/api/chat' && req.method === 'POST') {

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {

      try {

        const data = JSON.parse(body);

        if (!data.message) {
          throw new Error('Mesaj boş olamaz.');
        }

        if (!GEMINI_API_KEY) {
          throw new Error(
            'GEMINI_API_KEY bulunamadı.'
          );
        }

        // ==========================================
        // SOHBET GEÇMİŞİ
        // ==========================================

        const messages =
          Array.isArray(data.messages)
            ? data.messages
            : [];

        // ==========================================
        // KULLANICI HAFIZASI
        // ==========================================

        const memory =
          Array.isArray(data.memory)
            ? data.memory
            : [];

            const preferences =
  data.preferences || {};

const lengthPreference =
  preferences.responseLength || 'balanced';

const tonePreference =
  preferences.responseTone || 'normal';

        // ==========================================
        // AI SİSTEM TALİMATI
        // ==========================================

        const systemInstruction = `
Sen Power AI adlı, Türkçe öncelikli, güvenilir ve yardımcı
bir yapay zeka asistanısın.

AMAÇ
Kullanıcının sorusunu doğru anlamak, doğrudan cevap vermek ve
gerektiğinde konuyu anlaşılır biçimde öğretmektir.

...
Gereksiz soru sormadan, mümkün olduğunda uygulanabilir bir sonraki
adımı da sun.
`;

        // ==========================================
        // GEMINI MESAJLARI
        // ==========================================

        const contents = [];

        // Sistem talimatı
        contents.push({
          role: 'user',
          parts: [
            {
              text:
  systemInstruction +
  '\n\nKULLANICI YANIT TERCİHLERİ\n' +
  'Yanıt uzunluğu: ' +
  lengthPreference +
  '\nYanıt tonu: ' +
  tonePreference
            }
          ]
        });

        // ==========================================
        // HAFIZA
        // ==========================================

        if (memory.length > 0) {

          contents.push({
            role: 'user',
            parts: [
              {
                text:
                  `Kullanıcı hakkında bilinen bilgiler:\n\n` +
                  memory.join('\n')
              }
            ]
          });

        }

        // ==========================================
        // ÖNCEKİ SOHBET
        // ==========================================

        for (const item of messages) {

          if (
            !item ||
            !item.text
          ) {
            continue;
          }

          const role =
            item.role === 'model'
              ? 'model'
              : 'user';

          contents.push({
            role: role,
            parts: [
              {
                text: item.text
              }
            ]
          });

        }

        // ==========================================
        // YENİ MESAJ
        // ==========================================

        let documentText = '';

if (
  data.document &&
  typeof data.document.data === 'string' &&
  data.document.data.length > 0 &&
  data.document.mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
) {
  const documentBuffer = Buffer.from(
    data.document.data,
    'base64'
  );

  const extractedDocument =
    await mammoth.extractRawText({
      buffer: documentBuffer
    });

  documentText =
    extractedDocument.value.trim();
}

const newMessageParts = [
  {
    text: data.message || 'Bu belgeyi analiz et.'
  }
];

if (documentText) {
  newMessageParts.push({
    text:
      '\n\nWORD BELGESİ İÇERİĞİ:\n\n' +
      documentText
  });
}

if (
  data.image &&
  typeof data.image.data === 'string' &&
  data.image.data.length > 0 &&
  typeof data.image.mimeType === 'string' &&
  data.image.mimeType.startsWith('image/')
) {
  if (
  data.document &&
  typeof data.document.data === 'string' &&
  data.document.data.length > 0 &&
[
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
].includes(data.document.mimeType)
) {
  newMessageParts.push({
    inline_data: {
      mime_type: data.document.mimeType,
      data: data.document.data
    }
  });
}
  newMessageParts.push({
    inline_data: {
      mime_type: data.image.mimeType,
      data: data.image.data
    }
  });
}

contents.push({
  role: 'user',
  parts: newMessageParts
});
        // ==========================================
        // GEMINI API
        // ==========================================

     const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/' +
    GEMINI_MODEL +
    ':streamGenerateContent?alt=sse',
  {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },

    body: JSON.stringify({
      contents: contents
    })
  }
);

if (!response.ok) {
  const result = await response.json();

  throw new Error(
    result.error?.message ||
    'Gemini API hatası.'
  );
}

res.writeHead(200, {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
});

const reader = response.body.getReader();

while (true) {
  const chunk = await reader.read();

  if (chunk.done) {
    break;
  }

  res.write(chunk.value);
}

res.end();

      } catch (error) {

        console.error(
          'AI hata:',
          error
        );

        res.writeHead(500, {
          'Content-Type':
            'application/json; charset=utf-8'
        });

        res.end(
          JSON.stringify({
            error: error.message
          })
        );

      }

    });

    return;
  }


  // ==========================================
  // WEB SAYFALARINI SUN
  // ==========================================

  const requestPath =
    req.url === '/'
      ? '/index.html'
      : req.url;

  const safePath =
    path
      .normalize(requestPath)
      .replace(/^\/+/, '');

  const filePath =
    path.join(
      rootDir,
      safePath
    );

  fs.readFile(
    filePath,
    (error, content) => {

      if (error) {

        res.writeHead(404, {
          'Content-Type':
            'text/plain; charset=utf-8'
        });

        res.end('Not Found');

        return;
      }

      const mimeTypes = {

        '.html':
          'text/html; charset=utf-8',

        '.css':
          'text/css; charset=utf-8',

        '.js':
          'application/javascript; charset=utf-8'

      };

      const ext =
        path.extname(filePath);

      res.writeHead(200, {

        'Content-Type':
          mimeTypes[ext] ||
          'application/octet-stream'

      });

      res.end(content);

    }
  );

});


server.listen(
  port,
  () => {

    console.log(
      `Power AI Chatbot çalışıyor: http://127.0.0.1:${port}`
    );

  }
);