import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

let conexiondb;

const enlace = (resultado) => {
    mongoose.connect('mongodb://127.0.0.1:27017/ITJobFinder')
        .then(() => {
            conexiondb = mongoose.connection;
            return resultado();
        })
        .catch(err => {
            console.log('Fallo al conectar con la base de datos', err);
            return resultado(err);
        });
};

const llamardb = () => conexiondb;

export { enlace, llamardb };
