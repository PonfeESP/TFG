import { MongoClient } from 'mongodb';

let conexiondb;

const enlace = (resultado) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/ITJobFinder')
        .then((client) => {
            conexiondb = client.db();
            return resultado();
        })
        .catch(err => {
            console.log(err);
            return resultado(err);
        });
};

const llamardb = () => conexiondb;

export { enlace, llamardb };
