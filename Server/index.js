import express from 'express';
import { enlace, llamardb } from './conexiondb.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import { strategyInit } from './Passport/Autenticacion.js';
import User from './Modelos/Usuario.model.js';
import Tags from './Modelos/Tags.model.js';
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

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({ Rol: 'Desempleado' });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/tags', async (req, res) => {
  try {
    const tags = await Tags.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/empresas', async (req, res) => {
  try {
    const empresas = await User.find({ Rol: 'Empresa' });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/eventos', async (req, res) => {
  try {
    const fechaActual = new Date();

    const eventosFuturos = await Evento.find({
      Fecha: { $gte: fechaActual }
    });

    res.json(eventosFuturos);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/eventos/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/eventos_empresa/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const eventos = await Evento.find({
      Empresa: req.params.id 
    });
    console.log(eventos)
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/ofertas/:id', async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/ofertas_empresa/:id', async (req, res) => {
  try {
    const ofertas = await Oferta.find({
      Empresa: { $gte: req.params.id }
    });

    if (!ofertas) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/ofertas', async (req, res) => {
  try {
    const ofertas = await Oferta.find({ Disponible: true }).populate('Empresa', 'Nombre');
    console.log("JSJA", ofertas)
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/ofertas_ordenadas', async (req, res) => {  
  console.log("heofjaifm");

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

app.get('/ofertas/empresa', async (req, res) => {
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

app.post('/registro/usuario/desempleado', async (req, res) => {
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

app.post('/registro/usuario/empresa', async (req, res) => {
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


app.post('/registro_evento/:id', async (req, res) => {

  const idEmpresa = req.params.id
  const evento = req.body;

  try {
    const fechaEvento = new Date(evento.Fecha);

    const fechaActual = new Date();
    if (fechaEvento <= fechaActual) {
      return res.status(400).json({ error: 'La fecha del evento debe ser en el futuro' });
    }

    if (isNaN(fechaEvento.getTime())) {
      return res.status(400).json({ error: 'La fecha del evento es inválida' });
    }

    const fecha = fechaEvento.toISOString().split('T')[0];
    const hora = fechaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nuevoEvento = new Evento({
      Nombre: evento.Nombre,
      Fecha: fecha,
      Hora: hora,
      Descripcion: evento.Descripcion,
      Aforo: evento.Aforo,
      Empresa: idEmpresa
    });

    const respuesta = await nuevoEvento.save();
    res.status(201).json(respuesta);

  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});



app.post('/registro/ofertas', async (req, res) => {
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

app.post('/registro/solicitudes', async (req, res) => { //Version antigua, no valido por ahora
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

app.post('/tags', async (req, res) => {
  const tags = req.body;
  try {
    const existe = await Tags.findOne({ Nombre: tags.Nombre });

    if (existe) {
      return res.status(400).json({ error: 'Este Tag ya está registrado' });
    } else {
      const nuevoTag = new Tags({
        Nombre: tags.Nombre,
      });
      const respuesta = await nuevoTag.save();
      res.status(201).json({ status: 'OK', user: respuesta });
    }
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const userId = req.params.id;
  const newData = req.body;

  try {
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    Object.assign(usuario, newData);

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.put('/oferta/:id', async (req, res) => {
  const ofertaId = req.params.id;
  const newData = req.body;

  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'oferta no encontrado' });
    }

    Object.assign(oferta, newData);

    await oferta.save();

    res.status(200).json(oferta);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.put('/evento/:id', async (req, res) => {
  const eventoId = req.params.id;
  const newData = req.body;

  console.log("asasas",newData)

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'evento no encontrado' });
    }

    Object.assign(evento, newData);

    await evento.save();

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.put('/solicitud_oferta', async (req, res) => {
  const userId = req.body.userId;
  const ofertaId = req.body.ofertaId;
  console.log("aaa", userId, ofertaId)
  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      console.log("bbbb")
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    if (oferta.Interesados.includes(userId)) {
      console.log("ccccc")
      return res.status(400).json({ error: 'El usuario ya está registrado para esta oferta' });
    }

    oferta.Interesados.push(userId);
    await oferta.save();

    res.status(200).json({ message: 'Registro realizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.put('/solicitud_evento', async (req, res) => {
  const userId = req.body.userId;
  const eventoId = req.body.eventoId;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'eventop no encontrada' });
    }

    if (evento.Interesados.includes(userId)) {
      return res.status(400).json({ error: 'El usuario ya está registrado para esta oferta' });
    }

    evento.Interesados.push(userId);
    await evento.save();

    res.status(200).json({ message: 'Registro realizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});


// LOGIN POSTS

app.post("/login/usuario", passport.authenticate('local-usuario'), (req, res) => {
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
