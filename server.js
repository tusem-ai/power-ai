const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());

// Ana klasördeki statik dosyaları (index.html, style.css vb.) dışarı sunar
app.use(express.static(__dirname));

// Ana sayfaya girildiğinde direkt ana klasördeki index.html dosyasını gönderir
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu aktif: ${PORT}`);
});