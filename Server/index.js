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

app.get('/empresas', async (req, res) => { //SI
  try {
    const empresas = await User.find({ Rol: 'Empresa' });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/noInteresado_eventos/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const fechaActual = new Date();

    // Calcular la fecha actual más 24 horas
    const fechaLimite = new Date();
    fechaLimite.setHours(fechaLimite.getHours() + 24);

    const eventosFuturos = await Evento.find({
      Fecha: { $gte: fechaLimite },
      Interesados: { $not: { $eq: userId } } // Filtrar eventos en los que el usuario no esté interesado
    })
    .populate('Empresa', 'Nombre')
    .sort({ Fecha_Creacion: -1 });

    const eventosFormateados = eventosFuturos.map(evento => {
      const aforoRestante = evento.Aforo - evento.Interesados.length;
      return {
        ...evento.toObject(),
        Dia: evento.Fecha.toISOString().split('T')[0], // Obtener el día en formato YYYY-MM-DD
        Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Obtener la hora en formato HH:MM
        aforo_restante: aforoRestante
      };
    });

    res.json(eventosFormateados);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/interesado_evento/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const eventosInteresado = await Evento.find({
      Interesados: userId // Filtrar eventos en los que el usuario esté interesado
    })
    .populate('Empresa', 'Nombre')
    .sort({ Fecha_Creacion: -1 });

    const eventosFormateados = eventosInteresado.map(evento => {
      const aforoRestante = evento.Aforo - evento.Interesados.length;
      return {
        ...evento.toObject(),
        Dia: evento.Fecha.toISOString().split('T')[0], // Obtener el día en formato YYYY-MM-DD
        Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Obtener la hora en formato HH:MM
        aforo_restante: aforoRestante
      };
    });

    res.json(eventosFormateados);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/eventos/:id', async (req, res) => {
  try {
    // Find the event by its ID and populate the 'Empresa' field with 'Nombre'
    const evento = await Evento.findById(req.params.id).populate('Empresa', 'Nombre');
    
    // Check if the event exists
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Format the date and time of the event
    const eventoFormateado = {
      ...evento.toObject(),
      Dia: evento.Fecha.toISOString().split('T')[0], // Get the day in YYYY-MM-DD format
      Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Get the time in HH:MM format
    };

    res.json(eventoFormateado);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/eventos_empresa/:id', async (req, res) => {
  try {
    const eventos = await Evento.find({
      Empresa: req.params.id 
    });

    // Crear una nueva lista de eventos con aforo_restante calculado
    const eventosConAforoRestante = eventos.map(evento => {
      const aforoRestante = evento.Aforo - evento.Interesados.length;
      return {
        ...evento.toObject(),
        aforo_restante: aforoRestante
      };
    });

    res.json(eventosConAforoRestante);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/empresa_unica/:id', async (req, res) => {
  try {
    const empresa = await User.findById(req.params.id);
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/usuario_unico/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/ofertas/:id', async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id).populate('Empresa', 'Nombre');
    
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    const usuario = await User.findById(req.query.usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const porcentajeConcordancia = calcularPorcentajeConcordancia(usuario.Tags, oferta.Tags);
    const porcentajeCoincidenciaporTag = calcularPorcentajeCoincidenciaporTag(oferta, usuario);

    const ofertaConUsuario = {
      ...oferta.toObject(),
      Nombre_Usuario: usuario.Nombre,
      Porcentaje_Concordancia: porcentajeConcordancia,
      Porcentaje_Concordancia_Tag: porcentajeCoincidenciaporTag,
      Tags_Usuario: usuario.Tags
    };

    res.json(ofertaConUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/oferta_empresa/:id', async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id).populate('Empresa', 'Nombre');
    
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    res.json(oferta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fallo' });
  }
});

app.get('/noInteresado_ofertas/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Obtener todas las ofertas que no tienen al usuario en la lista de interesados
    const ofertasNoInteresadas = await Oferta.find({
      Interesados: { $ne: userId } // Filtrar ofertas que no contienen al usuario en la lista de interesados
    }).populate('Empresa', 'Nombre');

    const ofertasFormateadas = ofertasNoInteresadas.map(oferta => ({
      ...oferta.toObject(),
      Nombre_Empresa: oferta.Empresa.Nombre
    }));

    res.json(ofertasFormateadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fallo' });
  }
});


app.get('/interesado_ofertas/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Obtener todas las ofertas que tienen al usuario en la lista de interesados
    const ofertasInteresadas = await Oferta.find({
      Interesados: userId
    }).populate('Empresa', 'Nombre');

    const ofertasFormateadas = ofertasInteresadas.map(oferta => ({
      ...oferta.toObject(),
      Nombre_Empresa: oferta.Empresa.Nombre
    }));

    res.json(ofertasFormateadas);
  } catch (error) {
    console.error(error);
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

app.get('/ofertas_ordenadas/:id', async (req, res) => {
  console.log("asasa", req.params.id)
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioTags = usuario.Tags;

    const ofertas = await Oferta.find({ Disponible: true }).populate('Empresa', 'Nombre');
    ofertas.sort((a, b) => {
      const porcentajeA = calcularPorcentajeConcordancia(usuarioTags, a.Tags);
      const porcentajeB = calcularPorcentajeConcordancia(usuarioTags, b.Tags);
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
  console.log("evento", evento);

  try {
    const fechaEvento = new Date(evento.Fecha);
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 1); // Añadir un día a la fecha actual
    
    if (fechaEvento <= fechaLimite) {
      return res.status(400).json({ error: 'La fecha del evento debe ser al menos 24 horas en el futuro' });
    }

    if (isNaN(fechaEvento.getTime())) {
      return res.status(400).json({ error: 'La fecha del evento es inválida' });
    }

    const fechaActual = new Date(); // Se agrega la declaración de fechaActual aquí
    
    const nuevoEvento = new Evento({
      Nombre: evento.Nombre,
      Fecha: evento.Fecha,
      Descripcion: evento.Descripcion,
      Aforo: evento.Aforo,
      Localizacion: evento.Localizacion,
      Fecha_Creacion: fechaActual,
      Empresa: idEmpresa
    });

    const respuesta = await nuevoEvento.save();
    res.status(201).json(respuesta);

  } catch (error) {
    res.status(500).json({ error: 'Fallo' });
  }
});



app.post('/registro_oferta/:id', async (req, res) => {
  try {
    const idEmpresa = req.params.id;
    const oferta = req.body;

    const fechaActual = new Date(); // Se agrega la declaración de fechaActual aquí

    if (!oferta.Nombre || !oferta.Descripcion || !oferta.Tags || !oferta.Disponible || !oferta.Empresa) {
      return res.status(400).json({ error: "Mo se han rellenado los campos correctamente" });
    }


    const nuevaOferta = new Oferta({
      Nombre: oferta.Nombre,
      Descripcion: oferta.Descripcion,
      Tags: oferta.Tags,
      Disponible: oferta.Disponible,
      Fecha_Creacion: fechaActual,
      Empresa: idEmpresa,
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

app.put('/disponible_oferta/:id', async (req, res) => {
  const ofertaId = req.params.id;
  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    oferta.Disponible = false;
    await oferta.save();

    res.status(200).json({ message: 'Oferta desactivada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
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
  console.log("saas", req.body)
  const ofertaId = req.params.id;
  const newData = req.body;

  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'oferta no encontrada' });
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

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const fechaActual = new Date();
    const fechaEvento = new Date(newData.Fecha);
    const diferenciaTiempo = fechaEvento.getTime() - fechaActual.getTime();
    const diferenciaHoras = diferenciaTiempo / (1000 * 60 * 60);

    if (diferenciaHoras <= 24) {
      return res.status(400).json({ error: 'No se puede modificar el evento porque la fecha está a menos de 24 horas de la hora actual' });
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
  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    if (oferta.Interesados.includes(userId)) {
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

app.put('/solicitud_evento/:idEvento', async (req, res) => {
  const userId = req.body.userId;
  const eventoId = req.params.idEvento;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'evento no encontrada' });
    }

    if (evento.Interesados.includes(userId)) {
      return res.status(400).json({ error: 'El usuario ya está registrado para esta oferta' });
    }

    if (evento.Interesados.length >= evento.Aforo) {
      return res.status(400).json({ error: 'El evento ha alcanzado su límite de interesados' });
    }

    evento.Interesados.push(userId);
    await evento.save();

    res.status(200).json({ message: 'Registro realizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});


// DELETE

app.delete('/eliminar_oferta/:id', async (req, res) => {
  const ofertaId = req.params.id;
  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    await Oferta.findByIdAndDelete(ofertaId);

    res.status(200).json({ message: 'Oferta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.delete('/eliminar_evento/:id', async (req, res) => {
  const eventoId = req.params.id;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.status(200).json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});



app.delete('/retirar_solicitud_evento/:eventoId', async (req, res) => {
  const userId = req.body.userId;
  const eventoId = req.params.eventoId;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const index = evento.Interesados.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ error: 'El usuario no está registrado para este evento' });
    }

    evento.Interesados.splice(index, 1);
    await evento.save();

    res.status(200).json({ message: 'Usuario retirado del evento correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.delete('/retirar_solicitud_oferta/:ofertaId', async (req, res) => {
  const userId = req.body.userId;
  const ofertaId = req.params.ofertaId;
  try {
    const oferta = await Oferta.findById(ofertaId);
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    const index = oferta.Interesados.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ error: 'El usuario no está registrado para esta oferta' });
    }

    oferta.Interesados.splice(index, 1);
    await oferta.save();

    res.status(200).json({ message: 'Usuario retirado de la oferta correctamente' });
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

function calcularPorcentajeCoincidenciaporTag(oferta, usuario) {
  if (oferta && usuario) {
      const tagsUsuario = usuario.Tags.map(tag => ({ nombre: tag.Lenguaje, puntuacion: tag.Puntuacion }));
      const tagsOferta = oferta.Tags.map(tag => ({ nombre: tag.Lenguaje, puntuacion: tag.Puntuacion }));

      const coincidencias = tagsOferta.map(tagOferta => {
          const tagUsuario = tagsUsuario.find(tag => tag.nombre === tagOferta.nombre);
          if (tagUsuario) {
              const porcentaje = (tagUsuario.puntuacion / tagOferta.puntuacion) * 100;
              return { nombre: tagOferta.nombre, porcentaje };
          }
          return null;
      }).filter(Boolean);

      const coincidenciaState = {};
      coincidencias.forEach(coincidencia => {
          coincidenciaState[coincidencia.nombre] = coincidencia.porcentaje;
      });

      return coincidenciaState;
  }
  return null; // O puedes devolver un valor por defecto dependiendo de tus necesidades
}




export default app;
