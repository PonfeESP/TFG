import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Empresa from '../Modelos/empresa.js'; // Adjusted path to the model

// Define the strategyInit function
function strategyInit(passport) {
    console.log('Initializing passport strategy...'); // Log when initializing strategy

    passport.use('local-empresa', new LocalStrategy({
        usernameField: 'Email',
        passwordField: 'Contraseña'
      }, (Email, Contraseña, done) => {
        console.log('Inside local-empresa strategy callback'); // Log when entering the strategy callback
        Empresa.findOne({ Email: Email }).then(empresa => {
          console.log('Query executed'); // Log when the query is executed
          if (!empresa) {
            console.log('Empresa not found'); // Log if empresa is not found
            return done(null, false, { error: 'Empresa desconocida' });
          }
          // Assuming verifyPassword is a method defined on the Empresa model
          empresa.verifyPassword(String(Contraseña), (err, contraseñaEsCorrecta) => {
            if (err) {
              console.error('Error verifying password:', err); // Log any errors during password verification
              return done(err);
            }
            if (!contraseñaEsCorrecta) {
              console.log('Incorrect password'); // Log if password is incorrect
              return done(null, false);
            }
            console.log('Authentication successful'); // Log if authentication is successful
            return done(null, empresa);
          });
        }).catch(err => {
          console.error('Error finding empresa:', err); // Log any errors during Empresa findOne operation
          done(err);
        });
    }));
    

    passport.serializeUser((empresa, done) => {
        console.log('Serializing user:', empresa.id); // Log when serializing user
        done(null, empresa.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('Deserializing user:', id); // Log when deserializing user
        Empresa.findById(id, (err, empresa) => {
            if (err) {
              console.error('Error deserializing user:', err); // Log any errors during deserialization
              return done(err);
            }
            done(null, empresa);
        });
    });

    console.log('Passport strategy initialized successfully'); // Log when strategy initialization completes
}

// Export the strategyInit function
export { strategyInit };
