const express = require('express');
const app = express();
const loginRoutes = require('./routes/LoginRoutes');
const connectToMongoDB = require('./connections/mongoDb');
const port = 5000;

connectToMongoDB();

app.use(express.json());
app.use('/api', loginRoutes)

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});