import express from 'express';
import { enlace, llamardb } from './conexiondb.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import { strategyInit } from './Passport/Autenticacion.js';
import User from './Modelos/Usuario.model.js';
import Evento from './Modelos/Evento.model.js';
import Oferta from './Modelos/Ofertas.model.js';

const app = express();
app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));


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
    const usuarios = await User.find({ Rol: 'Desempleado' });
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

app.get('/Mostrar/Oferta/Unica', async (req, res) => {
  try {
    const idOferta = req.query.idOferta;
    const oferta = await Oferta.findById(idOferta);
    console.log(' AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ', idOferta);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }
    res.json(oferta);
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

app.get('/Mostrar/Ofertas/Ordenadas', async (req, res) => {
  try {
    const usuarioTags = [
      { Lenguaje: "C", Puntuacion: 3 },
      { Lenguaje: "Java", Puntuacion: 5 },
      { Lenguaje: "JavaScript", Puntuacion: 1 },
      { Lenguaje: "Python", Puntuacion: 5 }

    ];
    const ofertas = await Oferta.find({ Disponible: true });
    ofertas.sort((a, b) => {
      console.log(`Sasdad`, a.Tags);
      const porcentajeA = calcularPorcentajeConcordancia(usuarioTags, a.Tags);
      console.log(`Sasdad`, porcentajeA);
      const porcentajeB = calcularPorcentajeConcordancia(usuarioTags, b.Tags);
      console.log(`Sasdad`, porcentajeB);
      return porcentajeB - porcentajeA;
    });

    const ofertasConPorcentaje = ofertas.map(oferta => {
      const porcentaje = calcularPorcentajeConcordancia(usuarioTags, oferta.Tags);
      return {
        ...oferta._doc,
        PorcentajeConcordancia: porcentaje.toFixed(2)
      };
    });

    res.json(ofertasConPorcentaje);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/Mostrar/Ofertas/Empresa', async (req, res) => {
  try {
    const idempresa = new ObjectId('65d36ce2e3c807a31324a657');//req.user.id;
    const ofertas = await Oferta.find({ Empresa: idempresa });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/Mostrar/Solicitudes', async (req, res) => { //Version antigua, no es valido por ahora
  try {
    console.log("data", req.isAuthenticated());
    const solicitudes = db.collection('Solicitudes');
    const solicitudesData = await solicitudes.find().toArray();
    res.json(solicitudesData);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/Mostrar/Solicitudes/Empresa', async (req, res) => { //Version antigua, no es valido por ahora
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

app.post('/Registro/Usuario/Desempleado', async (req, res) => {
  const usuario = req.body;
  console.log('XD', req.body);

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
        Edad: parseInt(usuario.Edad),
        Experiencia_Laboral: parseInt(usuario.Experiencia_Laboral),
        Estudios: usuario.Estudios,
        Tags: usuario.Tags
      });
      const respuesta = await nuevoUsuario.save();
      res.status(201).json({ status: 'OK', user: respuesta });
    }
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.post('/Registro/Usuario/Empresa', async (req, res) => {
  const usuario = req.body;
  console.log('XD', req.body);

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
        Descripcion: usuario.Descripcion
      });
      const respuesta = await nuevoUsuario.save();
      res.status(201).json({ status: 'OK', user: respuesta });
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
  try {
    const oferta = req.body;

    if (!oferta.Nombre || !oferta.Descripcion || !oferta.Tags || !oferta.Disponible || !oferta.Empresa) {
      return res.status(400).json({ error: "Mo se han rellenado los campos correctamente" });
    }

    const nuevaOferta = new Oferta({
      Nombre: oferta.Nombre,
      Descripcion: oferta.Descripcion,
      Tags: oferta.Tags,
      Disponible: oferta.Disponible,
      Empresa: oferta.Empresa,
      Interesados: oferta.Interesados
    });

    const respuesta = await nuevaOferta.save();
    res.status(201).json(respuesta);
  } catch (error) {
    console.error("Error al crear la Oferta:", error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

app.post('/Registro/Solicitudes', async (req, res) => { //Version antigua, no valido por ahora
  try {
    const solicitud = req.body;
    const ofertaId = solicitud.ofertaId;

    const ofertaExistente = await Oferta.findById(ofertaId);

    if (!ofertaExistente) {
      return res.status(404).json({ error: "Error en la Oferta" });
    }

    ofertaExistente.Interesados.push(...solicitud.Interesados);

    const ofertaActualizada = await ofertaExistente.save();

    res.status(200).json(ofertaActualizada);
  } catch (error) {
    console.error("No se ha podido realizar la solicitud", error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// LOGIN POSTS

app.post("/Login/Usuario", passport.authenticate('local-usuario'), (req, res) => {  
  if (!!req.user) {
    res.status(200).json({ status: 'OK', Rol: req.user.Rol })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post("/logout", (req, res) => { //Ni idea de si funciona
  req.logout(err => {
    if (!!err) res.status(500).json({ error: "No se ha podido cerrar sesión." });
    else {
      delete req.user;
      req.session.destroy();
      res.status(200).clearCookie('SessionCookie.SID', { path: "/" }).json({ status: "Ok" });
    }
  })
});

app.get("/user", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session.passport.user) : res.status(401).send('Sesión no iniciada!'));

//Funciones

function calcularPorcentajeConcordancia(usuarioTags, ofertaTags) {
  let sumaPuntuacionesCoincidentes = 0;
  let puntuacionTotalOferta = 0;

  const TagsOferta = {};
  ofertaTags.forEach(tag => {
    TagsOferta[tag.Lenguaje] = tag.Puntuacion;
      puntuacionTotalOferta += tag.Puntuacion;
  });

  usuarioTags.forEach(tag => {
      const puntuacionOferta = TagsOferta[tag.Lenguaje];
      if (puntuacionOferta !== undefined) {
          sumaPuntuacionesCoincidentes += Math.min(tag.Puntuacion, puntuacionOferta);
      }
  });

  const porcentajeConcordancia = (sumaPuntuacionesCoincidentes / puntuacionTotalOferta) * 100;

  return porcentajeConcordancia;
}

const usuarioTags = [
  { Lenguaje: "C", Puntuacion: 5 },
  { Lenguaje: "Java", Puntuacion: 3 },
  { Lenguaje: "Python", Puntuacion: 4 }
];

const ofertaTags = [
  { Lenguaje: "C", Puntuacion: 3 },
  { Lenguaje: "Java", Puntuacion: 5 }
];

const porcentajeConcordancia = calcularPorcentajeConcordancia(usuarioTags, ofertaTags);
console.log("Porcentaje de concordancia:", porcentajeConcordancia);


export default app;
