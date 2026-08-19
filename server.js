const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

// Projedeki tüm klasörleri ve index.html dosyasını otomatik tarar
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu aktif: ${PORT}`);
});