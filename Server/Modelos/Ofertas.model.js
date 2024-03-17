import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const TagsSchema = new Schema({
    Lenguaje: String,
    Puntuacion: Number
}, { _id: false });

const ofertaSchema = new Schema({
    Nombre: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: true
    },
    Tags: {
        type: [TagsSchema],
        required: true
    },
    
    Disponible: {
        type: Boolean,
        required: true
    },
    Empresa: {
        type: ObjectId,
        required: true
    },
    Interesados: {
        type: [ObjectId]
    }
});

const Oferta = mongoose.model('Ofertas', ofertaSchema, 'Ofertas');
export const schema = Oferta.schema;
export default Oferta;