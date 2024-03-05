import express from 'express';
import { enlace, llamardb } from './conexiondb.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';

import { strategyInit } from './Passport/Autenticacion.js';
import User from './Modelos/Usuario.model.js';
import Evento from './Modelos/Evento.model.js';
import Oferta from './Modelos/Ofertas.model.js';

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

app.get('/Mostrar/Usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({ Rol: 'Empresa' });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/Mostrar/Empresas', async (req, res) => {
  try {
    const empresas = await User.find({ Rol: 'Empresa' });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/Mostrar/Ofertas', async (req, res) => {
  try {
    const ofertas = await Oferta.find({ Disponible: true });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/Mostrar/Ofertas/Empresa', async (req, res) => {
  try {
    const idempresa = new ObjectId('65d5ea83ba8482276f009d80');//req.user.id;
    const ofertas = await Oferta.find({ Disponible: true }, { _id: idempresa });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarSolicitudes', async (req, res) => { //Version antigua, no es valido por ahora
  try {
    const solicitudes = db.collection('Solicitudes');
    const solicitudesData = await solicitudes.find().toArray();
    res.json(solicitudesData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/mostrarSolicitudes/empresa', async (req, res) => { //Version antigua, no es valido por ahora
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

app.get('/mostrarSolicitudes/usuario', async (req, res) => { //Version antigua, no es valido por ahora
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

//POSTS

app.post('/Registro/Usuario', async (req, res) => {
  const usuario = req.body;

  try {
    const usuarioExistente = await User.findOne({ Email: usuario.Email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este Email ya está registrado' });
    } else {
      const nuevoUsuario = new User({
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        Contraseña: usuario.Contraseña,
        Rol: usuario.Rol,
        Descripcion: usuario.Descripcion,
        Edad: usuario.Edad,
        Experiencia_Laboral: usuario.Experiencia_Laboral,
        Estudios: usuario.Estudios,
        Tags: usuario.Tags
      });
      const respuesta = await nuevoUsuario.save();
      res.status(201).json(respuesta);
    }
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.post('/Registro/Evento', async (req, res) => {
  const evento = req.body;

  try {
    const nuevoEvento = new Evento({
      Nombre: evento.Nombre,
      Fecha: evento.Fecha,
      Descripcion: evento.Descripcion,
      Aforo: evento.Aforo,
      Empresa: evento.Empresa
    });
    const respuesta = await nuevoEvento.save();
    res.status(201).json(respuesta);

  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.post('/Registro/Ofertas', async (req, res) => {
  const oferta = req.body;

  db.collection('Ofertas').insertOne(oferta).then(respuesta => {
    res.status(201).json(respuesta)
  })
    .catch(error => {
      res.status(500).json({ error: 'Fallo' })
    })
});

app.post('/Registro/Solicitudes', async (req, res) => { //Version antigua, no valido por ahora
  const oferta = req.body;

  db.collection('Ofertas').insertOne(oferta).then(respuesta => {
    res.status(201).json(respuesta)
  })
    .catch(error => {
      res.status(500).json({ error: 'Fallo' })
    })
});

// LOGIN POSTS

app.post("/Login/Usuario", passport.authenticate('local-usuario'), (req, res) => { //fallo en el Autenticacion.js
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
