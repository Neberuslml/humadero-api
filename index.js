import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Humadero API funcionando 🔥');
});

const PORT = process.env.PORT || 3000;

app.get('/menu', (req, res) => {
  res.json({
    comida: [
      { id: 1, nombre: 'Taco al Pastor', precio: 20 },
      { id: 2, nombre: 'Taco de Asada', precio: 22 },
      { id: 3, nombre: 'Quesadilla', precio: 25 }
    ],
    bebidas: [
      { id: 4, nombre: 'Refresco', precio: 18 },
      { id: 5, nombre: 'Agua', precio: 15 }
    ],
    postres: [
      { id: 6, nombre: 'Flan', precio: 25 },
      { id: 7, nombre: 'Gelatina', precio: 20 }
    ]
  });
});


app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);

});
