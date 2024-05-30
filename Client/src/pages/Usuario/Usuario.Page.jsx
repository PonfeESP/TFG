import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Inicio from '../../components/Inicio.component';
import ComponenteDesempleado from './Componentes/ComponentesDesempleado/Desempleado.componente';
import SubComponenteEmpresas from './Componentes/ComponentesDesempleado/Empresa.componente';
import SubComponenteEventos from './Componentes/ComponentesDesempleado/Evento.componente';
import SubComponenteUsuarios from './Componentes/ComponentesEmpresa/Usuarios.componente';
import SubComponenteOfertas from './Componentes/ComponentesEmpresa/Ofertas.componente';
import SubComponenteEventosEmpresa from './Componentes/ComponentesEmpresa/Eventos.componente';
import Perfil from './Componentes/Perfil.componente';
import Header from '../../components/Header2.component';
import { Typography } from '@mui/material';

export const Usuario = () => {
    const location = useLocation();

    const [userType, setUserType] = useState('');
    const [finishLoading, setFinishLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('inicio');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (location.state && location.state.valor) {
            setActiveComponent(location.state.valor);
        }
    }, [location.key, location.state]);

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
    const handleMostrarUsuarios = () => setActiveComponent('usuarios');
    const handleMostrarOfertas = () => setActiveComponent('ofertas');
    const handleMostrarPerfil = () => setActiveComponent('perfil');


    if (!finishLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header
                onMostrarDesempleado={handleMostrarDesempleado}
                onMostrarEmpresa={handleMostrarEmpresa}
                onMostrarEvento={handleMostrarEvento}
                onMostrarUsuarios={handleMostrarUsuarios}
                onMostrarOfertas={handleMostrarOfertas}
                onMostrarEventos={handleMostrarEvento}
                onMostrarPerfil={handleMostrarPerfil}
            />

            {userType === 'Desempleado' && (
                <>
                    {activeComponent === 'inicio' && <Inicio userId={userId} userType={userType} />}
                    {activeComponent === 'desempleado' && <ComponenteDesempleado userId={userId} userType={userType} />}
                    {activeComponent === 'empresa' && <SubComponenteEmpresas userId={userId} userType={userType} />}
                    {activeComponent === 'evento' && <SubComponenteEventos userId={userId} userType={userType} />}
                    {activeComponent === 'perfil' && <Perfil userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'Empresa' && (
                <>
                    {activeComponent === 'inicio' && <Inicio userId={userId} userType={userType} />}
                    {activeComponent === 'usuarios' && <SubComponenteUsuarios userId={userId} userType={userType} />}
                    {activeComponent === 'ofertas' && <SubComponenteOfertas userId={userId} userType={userType} />}
                    {activeComponent === 'evento' && <SubComponenteEventosEmpresa userId={userId} userType={userType} />}
                    {activeComponent === 'perfil' && <Perfil userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'tipo3' && (
                <Typography>Rusia</Typography>
            )}
        </>
    );
};

export default Usuario;
