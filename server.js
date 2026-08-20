const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());

// 1. Hem public klasörünü hem ana dizini dışarı sun
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// 2. index.html ister public içinde olsun ister ana dizinde, bulup açar
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu aktif: ${PORT}`);
});