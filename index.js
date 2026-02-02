import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Humadero API funcionando 🔥');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});