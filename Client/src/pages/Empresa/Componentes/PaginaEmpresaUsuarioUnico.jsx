import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const PaginaEmpresaUsuarioUnico = () => {
    const { idUsuario } = useParams();
    const [usuario, setEmpresa] = useState(null);

    console.log("aaa",idUsuario)

    useEffect(() => {
        axios.get(`http://localhost:8000/usuario_unico/${idUsuario}`)
            .then(res => {
                setEmpresa(res.data);
            })
            .catch(err => console.log(err));
    }, [idUsuario]);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            {usuario && (
                <>
                    <Typography variant="h4">{usuario.Nombre}</Typography>
                    <Typography variant="body1">Email: {usuario.Email}</Typography>
                    <Typography variant="body1">Descripción: {usuario.Descripcion}</Typography>
                </>
            )}
        </div>
    );
};


export default PaginaEmpresaUsuarioUnico;
