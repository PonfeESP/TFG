import express from 'express';
import { enlace, llamardb } from './conexiondb.js';

const app = express();
app.use(express.json())

let db;

enlace((error) => {
  if (!error) {
    app.listen(8000, () => {
      console.log(`Servidor escuchando en el puerto 8000`);
    });
    db = llamardb();
  }
});


// GET endpoints to retrieve information
app.get('/mostrarEmpresas', async (req, res) => {
  try {
    const empresas = db.collection('Empresas');
    const empresasData = await empresas.find().toArray();
    res.json(empresasData);
  } catch (error) {
    console.error('Error al recibir la informacion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/mostrarOfertas', async (req, res) => {
  try {
    const ofertas = db.collection('Ofertas');
    const ofertasData = await ofertas.find().toArray();
    res.json(ofertasData);
  } catch (error) {
    console.error('Error al recibir la informacion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/mostrarSolicitudes', async (req, res) => {
  try {
    const solicitudes = db.collection('Solicitudes');
    const solicitudesData = await solicitudes.find().toArray();
    res.json(solicitudesData);
  } catch (error) {
    console.error('Error al recibir la informacion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/mostrarUsers', async (req, res) => {
  try {
    const users = db.collection('Users');
    const usersData = await users.find().toArray();
    res.json(usersData);
  } catch (error) {
    console.error('Error al recibir la informacion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/crearEmpresa', async (req, res) => {
  const empresa = req.body;

  db.collection('Empresas')
    .insertOne(empresa)
    .then(respuesta => {
      res.status(201).json(respuesta)
    })
    .catch(err => {
      res.status(500).json({err: 'Fallo'})
    })
});

// POST endpoint para el inicio de sesión
app.post('/loginEmpresa', async (req, res) => {
  const { Email, Contraseña } = req.body;

  db.collection('Empresas')
    .findOne({ Email: Email }, { projection: { Email: 1, Contraseña: 1 } })
    .then(empresa => {
      if (!empresa) {
        res.status(404).json({ error: 'Este usuario no existe o es incorrecto' });
      } else {
        if (empresa.Contraseña === Contraseña) {
          res.status(200).json({ respuesta: 'Inicio de sesión exitoso' });
        } else {
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error lado servidor' });
    });
});


export default app;
