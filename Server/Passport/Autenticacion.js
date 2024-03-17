import { Strategy as LocalStrategy } from 'passport-local';
import { llamardb, enlace } from '../conexiondb.js';
import express from 'express';
import User from '../Modelos/Usuario.model.js'; // Importa el modelo de usuario

const app = express();
app.use(express.json());

let db;

enlace((error) => {
  if (!error) {
    db = llamardb();
  }
});

let query;

export const strategyInit = passport => {
  passport.use('local-usuario', new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Contraseña'
  }, (Email, Contraseña, done) => {
    query = db.collection('Usuario'); //Si intento hacerlo con User.findOne no va
    query.findOne({ Email: Email }, { projection: { Email: 1, Contraseña: 1, Rol: 1 } }).then(usuario => {
      if (!usuario) return done(null, false, { error: 'Usuario desconocido' });
      if (usuario.Contraseña !== Contraseña) {
        return done(null, false, { error: 'Contraseña incorrecta' });
      }
      return done(null, usuario);
    }).catch(err => {
      done(err);
    });
  }));

  passport.serializeUser((user, done) => {
    const userType = user.Rol;

    if (userType) {
      done(null, {
        id: user._id.toString(),
        userType
      });
    } else {
      done(new Error('Tipo de usuario inválido'));
    }
  });

  passport.deserializeUser((user, done) => {
    query.findOne({ _id: user.id }, (err, usuario) => {
      if (err) {
        return done(err);
      }
      done(null, usuario);
    });
  });
};

export default strategyInit;
