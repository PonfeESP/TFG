import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const eventoSchema = new Schema({
    Nombre: {
        type: String,
        required: true
    },
    Fecha: {
        type: Date,
        required: true
    },
    Hora: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: true
    },
    Aforo: {
        type: Number,
        required: true
    },
    Localizacion: {
        type: String,
        required: true
    },
    Empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    Interesados: {
        type: [ObjectId]
    }
});

const Evento = mongoose.model('Eventos', eventoSchema, 'Eventos');
export const schema = Evento.schema;
export default Evento;