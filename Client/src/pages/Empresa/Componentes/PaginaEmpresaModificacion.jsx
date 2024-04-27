import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import './PaginaEmpresaModificacion.css'; // Importamos el archivo CSS

export const PaginaEmpresaModificacion = ({ userId }) => {
    const [usuario, setUsuario] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8000/usuarios/${userId}`)
            .then(res => {
                const userData = res.data;
                setUsuario(userData);
                setNombre(userData.Nombre);
                setEmail(userData.Email);
                setDescripcion(userData.Descripcion);
            })
            .catch(err => console.log(err));
    }, [userId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedUser = {
            Nombre: nombre,
            Email: email,
            Descripcion: descripcion,
        };

        axios.put(`http://localhost:8000/usuarios/${userId}`, updatedUser)
            .then(res => {
                console.log('Usuario actualizado:', res.data);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="pagina-desempleado-modificacion-container">
            <Paper elevation={3} className="formulario">
                <Typography variant="h4" className="titulo">Modificar Perfil</Typography>
                {usuario && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción:</label>
                            <input id="descripcion" type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        </div>
                        <button type="submit">Guardar Cambios</button>
                    </form>
                )}
            </Paper>
        </div>
    );
};

export default PaginaEmpresaModificacion;
