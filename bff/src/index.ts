import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from BFF aeeeeeeee');
});

app.listen(port, () => {
  console.log(`BFF is running at http://localhost:${port}`);
});