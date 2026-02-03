import express from 'express';
import cors from 'cors';

const app = express();

// CORS que permita tu frontend
app.use(cors({
  origin: ['https://neberuslml.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ========== RUTAS PRINCIPALES ==========

// 1. Home - Con más información
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🔥 Humadero API funcionando correctamente',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      { method: 'GET', path: '/', description: 'Información de la API' },
      { method: 'GET', path: '/menu', description: 'Menú completo por categorías' },
      { method: 'GET', path: '/menu/:categoria', description: 'Menú por categoría (comida, bebidas, postres)' },
      { method: 'GET', path: '/health', description: 'Estado del servidor' },
      { method: 'GET', path: '/test', description: 'Ruta de prueba' },
      { method: 'POST', path: '/pedidos', description: 'Crear nuevo pedido' }
    ],
    frontend: 'https://neberuslml.github.io/Humadero',
    repo: 'https://github.com/Neberuslml/api-humadero'
  });
});

// 2. Menú COMPLETO (ESTRUCTURA CORRECTA para tu frontend)
app.get('/menu', (req, res) => {
  const menuCompleto = {
    comida: [
      { 
        id: 1, 
        nombre: '🌮 Taco al Pastor', 
        precio: 20, 
        descripcion: 'Cerdo marinado con piña y especias',
        categoria: 'comida',
        popular: true
      },
      { 
        id: 2, 
        nombre: '🥩 Taco de Asada', 
        precio: 22, 
        descripcion: 'Carne asada con cilantro y cebolla',
        categoria: 'comida',
        popular: true
      },
      { 
        id: 3, 
        nombre: '🧀 Quesadilla', 
        precio: 25, 
        descripcion: 'Queso Oaxaca derretido en tortilla de maíz',
        categoria: 'comida'
      },
      { 
        id: 8, 
        nombre: '🌯 Burrito Gigante', 
        precio: 35, 
        descripcion: 'Burrito con carne, frijoles, arroz y guacamole',
        categoria: 'comida',
        popular: true
      }
    ],
    bebidas: [
      { 
        id: 4, 
        nombre: '🥤 Refresco 600ml', 
        precio: 18, 
        descripcion: 'Refresco de cola, naranja o limón',
        categoria: 'bebidas'
      },
      { 
        id: 5, 
        nombre: '💧 Agua Natural 500ml', 
        precio: 15, 
        descripcion: 'Agua purificada',
        categoria: 'bebidas'
      },
      { 
        id: 9, 
        nombre: '🍹 Agua de Horchata 1L', 
        precio: 25, 
        descripcion: 'Refrescante agua de horchata',
        categoria: 'bebidas',
        popular: true
      }
    ],
    postres: [
      { 
        id: 6, 
        nombre: '🍮 Flan Napolitano', 
        precio: 25, 
        descripcion: 'Flan casero con caramelo',
        categoria: 'postres'
      },
      { 
        id: 7, 
        nombre: '🍓 Gelatina de Frutas', 
        precio: 20, 
        descripcion: 'Gelatina con frutas frescas de temporada',
        categoria: 'postres'
      },
      { 
        id: 10, 
        nombre: '🍰 Pastel de Chocolate', 
        precio: 30, 
        descripcion: 'Porción de pastel de chocolate belga',
        categoria: 'postres',
        popular: true
      }
    ]
  };
  
  res.json(menuCompleto);
});

// 3. Menú por categoría (endpoint que usa tu frontend)
app.get('/menu/:categoria', (req, res) => {
  const { categoria } = req.params;
  
  const menuCompleto = {
    comida: [
      { id: 1, nombre: 'Taco al Pastor', precio: 20, categoria: 'comida' },
      { id: 2, nombre: 'Taco de Asada', precio: 22, categoria: 'comida' },
      { id: 3, nombre: 'Quesadilla', precio: 25, categoria: 'comida' },
      { id: 8, nombre: 'Burrito Gigante', precio: 35, categoria: 'comida' }
    ],
    bebidas: [
      { id: 4, nombre: 'Refresco', precio: 18, categoria: 'bebidas' },
      { id: 5, nombre: 'Agua Natural', precio: 15, categoria: 'bebidas' },
      { id: 9, nombre: 'Agua de Horchata', precio: 25, categoria: 'bebidas' }
    ],
    postres: [
      { id: 6, nombre: 'Flan', precio: 25, categoria: 'postres' },
      { id: 7, nombre: 'Gelatina', precio: 20, categoria: 'postres' },
      { id: 10, nombre: 'Pastel de Chocolate', precio: 30, categoria: 'postres' }
    ]
  };
  
  const items = menuCompleto[categoria] || [];
  res.json(items);
});

// 4. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'Humadero API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    node: process.version
  });
});

// 5. Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Ruta de prueba funcionando correctamente',
    test_data: {
      producto: 'Taco al Pastor',
      precio: 20,
      categoria: 'comida'
    },
    timestamp: new Date().toISOString()
  });
});

// 6. Crear pedido
app.post('/pedidos', (req, res) => {
  try {
    const { cliente, items, total, direccion, telefono } = req.body;
    
    if (!cliente || !items || !total) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan cliente, items o total'
      });
    }
    
    // Simular ID de pedido
    const pedidoId = 'PED-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    res.json({
      success: true,
      message: '🎉 ¡Pedido recibido con éxito!',
      pedido: {
        id: pedidoId,
        cliente: cliente,
        items: items,
        total: total,
        direccion: direccion || 'Por recoger en tienda',
        telefono: telefono || 'No proporcionado',
        estado: 'pendiente',
        fecha: new Date().toLocaleString('es-MX'),
        estimado: '30-45 minutos'
      },
      next_steps: 'Te contactaremos para confirmar tu pedido'
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error interno',
      message: error.message
    });
  }
});

// ========== MANEJO DE ERRORES ==========

// 404 para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    requested: req.originalUrl,
    method: req.method,
    available_routes: [
      'GET /',
      'GET /menu',
      'GET /menu/:categoria',
      'GET /health',
      'GET /test',
      'POST /pedidos'
    ],
    tip: 'Visita / para ver todos los endpoints disponibles'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 HUMADERO API INICIADA CORRECTAMENTE
  ==========================================
  📡 Puerto: ${PORT}
  🌐 URL: https://humadero-api.onrender.com
  ⏰ Hora: ${new Date().toLocaleString()}
  📊 Endpoints disponibles:
     • GET  /              - Info de la API
     • GET  /menu          - Menú completo
     • GET  /menu/:categoria - Productos por categoría
     • GET  /health        - Estado del servidor
     • GET  /test          - Ruta de prueba
     • POST /pedidos       - Crear pedido
  ==========================================
  `);
});
