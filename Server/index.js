import express from 'express';
import { enlace, llamardb } from './conexiondb.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';

import { strategyInit } from './Passport/Autenticacion.js';

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

app.use(session({
  secret: 'ocio-session-cookie-key',
  name: 'SessionCookie.SID',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 //DURACIÓN DE 1 HORA LA SESIÓN (MILISEGUNDOS)
  }
}))
app.use(passport.initialize());
app.use(passport.session());
strategyInit(passport);


// GETs
app.get('/mostrarEmpresas', async (req, res) => {
  try {
    const empresas = db.collection('Empresas');
    const empresasData = await empresas.find().toArray();
    res.json(empresasData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarOfertas', async (req, res) => {
  try {
    const ofertas = db.collection('Ofertas');
    const ofertasData = await ofertas.find({ Disponible: { $ne: false } }).toArray();
    res.json(ofertasData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarOfertas/empresa', async (req, res) => {
  try {
    const ofertas = db.collection('Ofertas');
    const idempresa = new ObjectId('65d5ea83ba8482276f009d80');//req.user.id;
    const ofertasData = await ofertas.find({ Disponible: { $ne: false, } }, { _id: idempresa }).toArray();
    res.json(ofertasData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarSolicitudes', async (req, res) => {
  try {
    const solicitudes = db.collection('Solicitudes');
    const solicitudesData = await solicitudes.find().toArray();
    res.json(solicitudesData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarSolicitudes/empresa', async (req, res) => { //revisar dependencias de la query
  try {
    const solicitudes = db.collection('Solicitudes');
    const idempresa = new ObjectId('65d5ea83ba8482276f009d80');//req.user.id;
    console.log(`Sasdad`, idempresa);
    const solicitudesData = await solicitudes.find({ _id: idempresa }).toArray();
    res.json(solicitudesData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarSolicitudes/usuario', async (req, res) => {
  try {
    const solicitudes = db.collection('Solicitudes');
    const idusuario = new ObjectId('65d3660de3c807a31324a64e');//req.user.id;
    console.log(`Sasdad`, idusuario);
    const solicitudesData = await solicitudes.find({ Users: idusuario }).toArray();
    res.json(solicitudesData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarUsers', async (req, res) => {
  try {
    const users = db.collection('Users');
    const usersData = await users.find().toArray();
    res.json(usersData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

//POSTS

app.post('/registrarEmpresa', async (req, res) => {
  const empresa = req.body;

  try {
    const empresaQuery = db.collection('Empresas');
    const empresaData = await empresaQuery.find({ EmailEmpresa: empresa.EmailEmpresa }).toArray();
    if (empresaData.length > 0) {
      return res.status(400).json({ error: 'Este Email ya esta registrado' });
    } else {
      const respuesta = await db.collection('Empresas').insertOne(empresa);
      res.status(201).json(respuesta);
    }
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.post('/registrarUsuario', async (req, res) => {
  const usuario = req.body;

  try {
    const usuarioQuery = db.collection('Users');
    const usuarioData = await usuarioQuery.find({ EmailUsuario: usuario.EmailUsuario }).toArray();
    if (usuarioData.length > 0) {
      return res.status(400).json({ error: 'Este Email ya esta registrado' });
    } else {
      const respuesta = await db.collection('Users').insertOne(usuario);
      res.status(201).json(respuesta);
    }
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.post('/crearOfertas', async (req, res) => {
  const oferta = req.body;

  db.collection('Ofertas').insertOne(oferta).then(respuesta => {
      res.status(201).json(respuesta)
    })
    .catch(error => {
      res.status(500).json({ error: 'Fallo' })
    })
});

app.post('/crearSolicitudes', async (req, res) => {
  const oferta = req.body;

  db.collection('Ofertas').insertOne(oferta).then(respuesta => {
      res.status(201).json(respuesta)
    })
    .catch(error => {
      res.status(500).json({ error: 'Fallo' })
    })
});

// LOGIN POSTS

app.post("/loginEmpresa", passport.authenticate('local-empresa'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' });
  } else {
    res.status(500).json({ status: "Sesión no iniciada" });
  }
});


app.post("/loginUsuario", passport.authenticate('local-usuario'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post("/logout", (req, res) => {
  req.logout(err => {
    if (!!err) res.status(500).json({ error: "No se ha podido cerrar sesión." });
    else {
      delete req.user; 
      req.session.destroy(); 
      res.status(200).clearCookie('SessionCookie.SID', { path: "/" }).json({ status: "Ok" });
    }
  })
});


export default app;
