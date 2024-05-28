import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Inicio from '../../components/Inicio.component';
import OfertaEdicion from './Componentes/OfertaEdicion.componente';
import OfertaVisualizacion from './Componentes/OfertaVisualizacion.componente';
import Header from '../../components/Header2.component';
import { Typography } from '@mui/material';

export const Oferta = () => {
    const { idOferta } = useParams();
    const [userType, setUserType] = useState('');
    const [finishLoading, setFinishLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('visualizar');
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
                if (userType === 'Desempleado') {
                    setActiveComponent('visualizar');
                } else if (userType === 'Empresa') {
                    setActiveComponent('visualizar');
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleMostrarOferta = () => setActiveComponent('visualizar');
    const handleEditarOferta = () => setActiveComponent('editar');

    if (!finishLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header
                onMostrarOferta={handleMostrarOferta}
                onEditarOferta={handleEditarOferta}
            />

            {userType === 'Desempleado' && (
                <>
                    {activeComponent === 'visualizar' && <OfertaVisualizacion ofertaId={idOferta} userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'Empresa' && (
                <>
                    {activeComponent === 'visualizar' && <OfertaVisualizacion ofertaId={idOferta} userId={userId} userType={userType} />}
                    {activeComponent === 'editar' && <OfertaEdicion ofertaId={idOferta} userId={userId} userType={userType} />}
                </>
            )}
        </>
    );
};

export default Oferta;
