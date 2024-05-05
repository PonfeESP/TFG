import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const PaginaDesempleadoEmpresaUnica = () => {
    const { idEmpresa } = useParams();
    const [empresa, setEmpresa] = useState(null);

    console.log("aaa",idEmpresa)

    useEffect(() => {
        axios.get(`http://localhost:8000/empresa_unica/${idEmpresa}`)
            .then(res => {
                setEmpresa(res.data);
            })
            .catch(err => console.log(err));
    }, [idEmpresa]);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            {empresa && (
                <>
                    <Typography variant="h4">{empresa.Nombre}</Typography>
                    <Typography variant="body1">Email: {empresa.Email}</Typography>
                    <Typography variant="body1">Descripción: {empresa.Descripcion}</Typography>
                </>
            )}
        </div>
    );
};


export default PaginaDesempleadoEmpresaUnica;
