import { Strategy as LocalStrategy } from 'passport-local';
import { llamardb, enlace } from '../conexiondb.js';
import express from 'express';
import User from '../Modelos/Usuario.model.js';
import bcrypt from 'bcrypt';

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
    User.findOne(
      { Email: Email }, 
    ).then(async usuario => {
        if (!usuario) return done(null, false, { error: 'Usuario desconocido' });
        const isMatch = await bcrypt.compare(Contraseña, usuario.Contraseña);
        if (!isMatch) {
          return done(null, false, { error: 'Contraseña incorrecta' });
        }
        return done(null, usuario);
      })
      .catch(err => {
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
    User.findById(user.id).exec()
      .then(usuario => {
        done(null, usuario);
      })
      .catch(err => {
        done(err);
      });
  });
};  

export default strategyInit;
