import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import ComponenteDesempleado from './Componentes/ComponentesDesempleado/Desempleado.componente';
import SubComponenteEmpresas from './Componentes/ComponentesDesempleado/Empresa.componente';
import SubComponenteEventos from './Componentes/ComponentesDesempleado/Evento.componente';
import Header from '../../components/Header2.component';
import { Typography } from '@mui/material';

export const Usuario = () => {
    const [userType, setUserType] = useState('');
    const [finishLoading, setFinishLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('desempleado');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserType(res.data.userType);
                setUserId(res.data.id);
                setFinishLoading(!!res.data && !!res.data.userType);
            })
            .catch(err => console.log(err));
    }, []);

    const handleMostrarDesempleado = () => setActiveComponent('desempleado');
    const handleMostrarEmpresa = () => setActiveComponent('empresa');
    const handleMostrarEvento = () => setActiveComponent('evento');

    if (!finishLoading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <Header
                onMostrarOrdenada={handleMostrarDesempleado}
                onMostrarEmpresa={handleMostrarEmpresa}
                onMostrarEvento={handleMostrarEvento}
            />
            <Typography>Active Component: {activeComponent}</Typography>

            {userType === 'Desempleado' && (
                <>
                    {activeComponent === 'desempleado' && <ComponenteDesempleado userId={userId} />}
                    {activeComponent === 'empresa' && <SubComponenteEmpresas userId={userId} />}
                    {activeComponent === 'evento' && <SubComponenteEventos userId={userId} />}
                </>
            )}
            {userType === 'empresa' && (
                <Typography>America</Typography>
            )}
            {userType === 'tipo3' && (
                <Typography>Rusia</Typography>
            )}
        </>
    );
};

export default Usuario;
