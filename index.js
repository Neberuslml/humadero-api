import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar CORS para permitir tu frontend
app.use(cors({
  origin: [
    'https://neberuslml.github.io',  // Tu frontend en GitHub Pages
    'http://localhost:3000'           // Desarrollo local
  ],
  credentials: true
}));

app.use(express.json());

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Variables de entorno faltantes');
  console.log('Configura en Render:');
  console.log('SUPABASE_URL = https://tu-proyecto.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY = tu-service-role-key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Humadero API funcionando 🔥',
    version: '1.0.0',
    endpoints: {
      menu: '/menu',
      menuByCategory: '/menu/:categoria',
      createOrder: '/pedidos (POST)',
      health: '/health'
    },
    documentation: 'https://github.com/Neberuslml/api-humadero'
  });
});

// Obtener todo el menú (desde Supabase)
app.get('/menu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error Supabase:', error);
      
      // Fallback: datos de ejemplo si Supabase falla
      return res.json({
        comida: [
          { id: 1, nombre: 'Taco al Pastor', precio: 20, categoria: 'comida' },
          { id: 2, nombre: 'Taco de Asada', precio: 22, categoria: 'comida' },
          { id: 3, nombre: 'Quesadilla', precio: 25, categoria: 'comida' }
        ],
        bebidas: [
          { id: 4, nombre: 'Refresco', precio: 18, categoria: 'bebidas' },
          { id: 5, nombre: 'Agua', precio: 15, categoria: 'bebidas' }
        ],
        postres: [
          { id: 6, nombre: 'Flan', precio: 25, categoria: 'postres' },
          { id: 7, nombre: 'Gelatina', precio: 20, categoria: 'postres' }
        ],
        warning: 'Usando datos de ejemplo - Supabase no disponible'
      });
    }

    // Transformar datos para mantener compatibilidad
    const transformedData = {
      comida: data.filter(item => item.categoria === 'comida'),
      bebidas: data.filter(item => item.categoria === 'bebidas'),
      postres: data.filter(item => item.categoria === 'postres')
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error en /menu:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener menú por categoría
app.get('/menu/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('categoria', categoria)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error Supabase:', error);
      
      // Fallback con datos de ejemplo
      const exampleData = {
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
      };
      
      return res.json(exampleData[categoria] || []);
    }

    res.json(data || []);
  } catch (error) {
    console.error(`Error en /menu/${req.params.categoria}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo pedido
app.post('/pedidos', async (req, res) => {
  try {
    const { cliente, items, total, direccion, telefono, notas } = req.body;
    
    // Validación básica
    if (!cliente || !items || !total || !direccion || !telefono) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        requeridos: ['cliente', 'items', 'total', 'direccion', 'telefono']
      });
    }

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        cliente_nombre: cliente,
        cliente_telefono: telefono,
        cliente_direccion: direccion,
        items: items,
        total: parseFloat(total),
        notas: notas || '',
        estado: 'pendiente',
        fecha: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error al guardar pedido:', error);
      return res.status(500).json({ error: 'Error al guardar el pedido' });
    }

    res.json({
      success: true,
      message: 'Pedido creado exitosamente',
      pedido_id: data[0].id,
      datos: {
        cliente,
        total,
        estado: 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error en /pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de salud/verificación
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a Supabase
    const { data, error } = await supabase
      .from('menu')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      supabase: error ? 'disconnected' : 'connected',
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Ruta para probar sin Supabase
app.get('/test', (req, res) => {
  res.json({
    message: 'Ruta de prueba sin Supabase',
    data: {
      comida: [
        { id: 1, nombre: 'Taco al Pastor', precio: 20 },
        { id: 2, nombre: 'Taco de Asada', precio: 22 }
      ]
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    available_routes: ['/', '/menu', '/menu/:categoria', '/pedidos', '/health', '/test']
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Humadero API escuchando en puerto ${PORT}`);
  console.log(`📊 Supabase configurado: ${supabaseUrl ? 'SÍ' : 'NO'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: https://neberuslml.github.io/Humadero`);
});
