import express from 'express';
import { enlace, llamardb } from './conexiondb.js';
import { ObjectId } from 'mongodb';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';



import { strategyInit } from './Passport/Autenticacion.js';
import User from './Modelos/Usuario.model.js';
import Tags from './Modelos/Tags.model.js';
import Evento from './Modelos/Evento.model.js';
import Oferta from './Modelos/Ofertas.model.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfDirectory = path.join(__dirname, '', 'PDF');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pdfDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use('/pdfs', express.static('./PDF'));

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
  if (req.isAuthenticated()) {
    try {
      const usuarios = await User.find({ Rol: 'Desempleado' });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/usuarios/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const usuario = await User.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/tags', async (req, res) => {
    try {
      const tags = await Tags.find().sort({ Nombre: 1 });
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
});

app.get('/empresas', async (req, res) => { //SI
  if (req.isAuthenticated()) {
    console.log("que weas pasa")
    try {
      const empresas = await User.find({ Rol: 'Empresa' });
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/noInteresado_eventos/:userId', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.params.userId;

      const fechaActual = new Date();

      const fechaLimite = new Date();
      fechaLimite.setHours(fechaLimite.getHours() + 24);

      const eventosFuturos = await Evento.find({
        Fecha: { $gte: fechaLimite },
        Interesados: { $not: { $eq: userId } }
      })
        .populate('Empresa', 'Nombre')
        .sort({ Fecha_Creacion: -1 });

      const eventosFormateados = eventosFuturos.map(evento => {
        const aforoRestante = evento.Aforo - evento.Interesados.length;
        return {
          ...evento.toObject(),
          Dia: evento.Fecha.toISOString().split('T')[0],
          Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aforo_restante: aforoRestante
        };
      });

      res.json(eventosFormateados);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/interesado_evento/:userId', async (req, res) => {
  if (req.isAuthenticated()) {

    try {
      const userId = req.params.userId;

      const eventosInteresado = await Evento.find({
        Interesados: userId
      })
        .populate('Empresa', 'Nombre')
        .sort({ Fecha_Creacion: -1 });

      const eventosFormateados = eventosInteresado.map(evento => {
        const aforoRestante = evento.Aforo - evento.Interesados.length;
        return {
          ...evento.toObject(),
          Dia: evento.Fecha.toISOString().split('T')[0],
          Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aforo_restante: aforoRestante
        };
      });

      res.json(eventosFormateados);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


app.get('/eventos/:id', async (req, res) => {
  if (req.isAuthenticated()) {

    try {

      const evento = await Evento.findById(req.params.id).populate('Empresa', 'Nombre');
      const usuarios = await User.find({ _id: { $in: evento.Interesados } });

      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      const eventoFormateado = {
        ...evento.toObject(),
        Dia: evento.Fecha.toISOString().split('T')[0],
        Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      res.json({ eventoFormateado, usuarios });
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


app.get('/eventos_empresa/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const eventos = await Evento.find({
        Empresa: req.params.id
      });

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/empresa_unica/:id', async (req, res) => {
    try {
      const empresa = await User.findById(req.params.id);

      if (!empresa) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }

      const [ofertas, eventos] = await Promise.all([
        Oferta.find({ Empresa: req.params.id }).exec(),
        Evento.find({ Empresa: req.params.id }).exec()
      ]);

      const formattedEventos = eventos.map(evento => ({
        ...evento.toObject(),
        Dia: evento.Fecha.toISOString().split('T')[0],
        Hora: evento.Fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      console.log(formattedEventos);

      res.json({ empresa, ofertas: ofertas || [], eventos: formattedEventos || [] });
    } catch (error) {
      res.status(500).json({ error: 'Fallo del servidor' });
    }
});



app.get('/usuario_unico/:id', async (req, res) => {
  if (req.isAuthenticated()) {

    try {
      const usuario = await User.findById(req.params.id);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/ofertas/:id', async (req, res) => {
  console.log("papapa", req.isAuthenticated())
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/oferta_empresa/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/noInteresado_ofertas/:userId', async (req, res) => {
  if (req.isAuthenticated()) {

    try {
      const userId = req.params.userId;

      const ofertasNoInteresadas = await Oferta.find({
        Interesados: { $ne: userId }
      })
        .populate('Empresa', 'Nombre')
        .sort({ Fecha_Creacion: -1 });

      const ofertasFormateadas = ofertasNoInteresadas.map(oferta => ({
        ...oferta.toObject(),
        Nombre_Empresa: oferta.Empresa.Nombre
      }));

      res.json(ofertasFormateadas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


app.get('/interesado_ofertas/:userId', async (req, res) => {
  if (req.isAuthenticated()) {

    try {
      const userId = req.params.userId;

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});



app.get('/ofertas_empresa/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.get('/ofertas_ordenadas/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


//POSTS

app.post('/registro/usuario/desempleado', async (req, res) => {
  const usuario = req.body;

  try {
    const usuarioExistente = await User.findOne({ Email: usuario.Email });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este Email ya está registrado' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(usuario.Contraseña, salt);

      const nuevoUsuario = new User({
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        Contraseña: hashedPassword,
        Rol: usuario.Rol,
        Descripcion: usuario.Descripcion,
        Edad: parseInt(usuario.Edad),
        Experiencia_Laboral: parseInt(usuario.Experiencia_Laboral),
        Estudios: usuario.Estudios,
        Tags: usuario.Tags,
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

  try {
    const usuarioExistente = await User.findOne({ Email: usuario.Email });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este Email ya está registrado' });
    } else {
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(usuario.Contraseña, salt);

      const nuevoUsuario = new User({
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        Contraseña: hashedPassword,
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

  if (req.isAuthenticated()) {

    const idEmpresa = req.params.id;
    const evento = req.body;

    try {
      if (!evento.Nombre || !evento.Descripcion || !evento.Fecha || !evento.Localizacion || !evento.Aforo) {
        return res.status(400).json({ error: 'Todos los campos deben estar llenos' });
      }

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});




app.post('/registro_oferta/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const idEmpresa = req.params.id;
      const oferta = req.body;

      const fechaActual = new Date();

      if (!oferta.Nombre || !oferta.Descripcion || !oferta.Tags || oferta.Tags.length === 0 || !oferta.Disponible || !oferta.Empresa) {
        return res.status(400).json({ error: "No se han rellenado los campos correctamente. Asegúrate de proporcionar un nombre, una descripción, al menos un tag y especificar la disponibilidad." });
      }

      const tagNames = oferta.Tags.map(tag => tag.Lenguaje);
      const uniqueTagNames = new Set(tagNames);
      if (tagNames.length !== uniqueTagNames.size) {
        return res.status(400).json({ error: "No se permiten tags duplicados en la oferta." });
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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.post('/tags', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.put('/disponible_oferta/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  if (req.isAuthenticated()) {

    const userId = req.params.id;
    const newData = req.body;

    try {
      const usuario = await User.findById(userId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Validar si hay tags duplicados
      const lenguajes = new Set();
      for (const tag of newData.Tags) {
        if (lenguajes.has(tag.Lenguaje)) {
          return res.status(400).json({ error: 'No se pueden introducir tags con el mismo lenguaje' });
        }
        lenguajes.add(tag.Lenguaje);
      }

      Object.assign(usuario, newData);

      await usuario.save();

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


app.put('/usuarios/:id/pdf', upload.single('pdf'), async (req, res) => {
  if (req.isAuthenticated()) {

    const userId = req.params.id;
    const pdfFile = req.file;

    try {
      const usuario = await User.findById(userId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (pdfFile) {
        usuario.CurriculumPDF = pdfFile.filename;
      } else {
        usuario.CurriculumPDF = null;
      }

      await usuario.save();

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Fallo' });
    }
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.put('/oferta/:id', async (req, res) => {
  if (req.isAuthenticated()) {
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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.put('/evento/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


app.put('/solicitud_oferta', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.put('/solicitud_evento/:idEvento', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});


// DELETE

app.delete('/oferta/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.delete('/evento/:id', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});



app.delete('/solicitud_evento/:eventoId', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
  }
});

app.delete('/solicitud_oferta/:ofertaId', async (req, res) => {
  if (req.isAuthenticated()) {

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
  } else {
    res.status(401).send('Sesión no iniciada!');
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
  return null;
}

export default app;
