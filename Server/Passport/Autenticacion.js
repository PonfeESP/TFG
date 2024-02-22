import { Strategy as LocalStrategy } from 'passport-local';
import { llamardb, enlace } from '../conexiondb.js';
import { ObjectId } from 'mongodb';

import express from 'express';

const app = express();
app.use(express.json())

let db;

enlace((error) => {
  if (!error) {
    db = llamardb();
  }
});

export const strategyInit = passport => {
  passport.use('local-usuario', new LocalStrategy({
    usernameField: 'EmailUsuario',
    passwordField: 'Contraseña'
  }, (EmailUsuario, Contraseña, done) => {
    const usuarioQuery = db.collection('Users');
    usuarioQuery.findOne({ EmailUsuario: EmailUsuario }, { projection: { EmailUsuario: 1, Contraseña: 1 } }).then(usuario => {
      if (!usuario) return done(null, false, { error: 'Usuario desconocido' });
      if (usuario.Contraseña !== Contraseña) {
        return done(null, false, { error: 'Contraseña incorrecta' });
      }
      return done(null, usuario);
    }).catch(err => {
      done(err);
    });
  }));

  passport.use('local-empresa', new LocalStrategy({
    usernameField: 'EmailEmpresa',
    passwordField: 'Contraseña'
  }, (EmailEmpresa, Contraseña, done) => {
    const empresaQuery = db.collection('Empresas');
    empresaQuery.findOne({ EmailEmpresa: EmailEmpresa }, { projection: { EmailEmpresa: 1, Contraseña: 1 } }).then(empresa => {
      if (!empresa) return done(null, false, { error: 'Usuario desconocido' });
      if (empresa.Contraseña !== Contraseña) {
        return done(null, false, { error: 'Contraseña incorrecta' });
      }
      return done(null, empresa);
    }).catch(err => {
      done(err);
    });
  }));

  passport.use('local-admin', new LocalStrategy({
    usernameField: 'EmailAdmin',
    passwordField: 'Contraseña'
  }, (EmailAdmin, Contraseña, done) => {
    const adminQuery = db.collection('Admin');
    adminQuery.findOne({ EmailAdmin: EmailAdmin }, { projection: { EmailAdmin: 1, Contraseña: 1 } }).then(admin => {
      if (!admin) return done(null, false, { error: 'Usuario desconocido' });
      if (admin.Contraseña !== Contraseña) {
        return done(null, false, { error: 'Contraseña incorrecta' });
      }
      return done(null, admin);
    }).catch(err => {
      done(err);
    });
  }));


  

  passport.serializeUser((user, done) => {
    const userId = user._id.toString();
    done(null, userId);
  });
  
  
  passport.deserializeUser((id, done) => {
    const userId = new ObjectId(id); //Esquema
  });
  
  
};

export default strategyInit;