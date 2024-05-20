import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

let conexiondb;

/*const enlace = (resultado) => {
    mongoose.connect('mongodb://127.0.0.1:27017/ITJobFinder')
        .then(() => {
            conexiondb = mongoose.connection;
            return resultado();
        })
        .catch(err => {
            console.log('Fallo al conectar con la base de datos', err);
            return resultado(err);
        });
};*/

const enlace = (resultado) => {
    mongoose.connect('mongodb+srv://cassergiocanedo:UDhib3bpJQrf1Jq4@itjobfinder.dqcdtv3.mongodb.net/?retryWrites=true&w=majority&appName=ITJobFinder', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
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
