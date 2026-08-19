const express = require('express');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Power AI Chatbot Sunucusu Çalışıyor!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Power AI Chatbot çalışıyor: http://localhost:${PORT}`);
});