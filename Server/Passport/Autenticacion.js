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

let usuarioQuery;
let empresaQuery;
let adminQuery;

export const strategyInit = passport => {

  passport.use('local-usuario', new LocalStrategy({
    usernameField: 'EmailUsuario',
    passwordField: 'Contraseña'
  }, (EmailUsuario, Contraseña, done) => {
    usuarioQuery = db.collection('Users');
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
    empresaQuery = db.collection('Empresas');
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
    adminQuery = db.collection('Admin');
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
    let userType;
    if (user.EmailUsuario !== undefined) {
      userType = 'cliente';
    } else if (user.EmailEmpresa !== undefined) {
      userType = 'empresa';
    } else if (user.EmailAdmin !== undefined) {
      userType = 'admin';
    }

    console.log("User logged in. Type:", userType); // Simple log statement


    if (userType) {
      done(null, {
        id: user._id.toString(),
        userType
        
      });
    } else {
      done(new Error('Invalido'));
    }
  });

  passport.deserializeUser((user, done) => {
    const userId = new ObjectId(user.id); // Deserialize user ID
    const userType = user.userType; // Retrieve user type

    console.log("User logged iasdsadan. Type:", userType, userId); // Simple log statement

    let userCollection;
    if (userType === 'cliente') {
      userCollection = db.collection('Users');
    } else if (userType === 'empresa') {
      userCollection = db.collection('Empresas');
    } else if (userType === 'admin') {
      userCollection = db.collection('Admin');
    }

    if (userCollection) {
      userCollection.findOne({ _id: userId }, (err, usuario) => {
        if (err) {
          return done(err);
        }
        done(null, usuario);
      });
    } else {
      done(new Error('Ivalido'));
    }
  });



};

export default strategyInit;