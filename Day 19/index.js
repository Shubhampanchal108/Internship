const express = require('express');
const app = express();
const port = 3000;

const upload = require('./middleware');

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});