const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

// Public klasöründeki HTML, CSS ve JS dosyalarını dışarı sunar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfaya girildiğinde index.html dosyasını yükler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Power AI Chatbot çalışıyor: http://localhost:${PORT}`);
});