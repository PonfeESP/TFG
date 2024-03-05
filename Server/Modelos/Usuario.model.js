import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    Nombre: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Contraseña: {
        type: String,
        required: true
    },
    Rol: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: function () {
            return this.Rol === 'Empresa' || this.Rol === 'Desempleado';
        }
    },
    Edad: {
        type: Number,
        required: function () {
            return this.Rol === 'Desempleado';
        }
    },
    Experiencia_Laboral: {
        type: String,
        required: function () {
            return this.Rol === 'Desempleado';
        }
    },
    Estudios: {
        type: String,
        required: function () {
            return this.Rol === 'Desempleado';
        }
    },
    Tags: {
        type: [[String]],
        required: function () {
            return this.Rol === 'Desempleado';
        }
    }
});

const User = mongoose.model('Usuario', userSchema, 'Usuario');
export default User;