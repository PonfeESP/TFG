import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Inicio from '../../components/Inicio.component';
import EventoEdicion from './Componentes/EventoEdicion.componente';
import EventoVisualizacion from './Componentes/EventoVisualizacion.componente';
import Header from '../../components/Header2.component';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


export const Evento = () => {
    const { idEvento } = useParams();
    const [userType, setUserType] = useState('');
    const [finishLoading, setFinishLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('visualizar');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

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

    const handleMostrarEvento = () => setActiveComponent('visualizar');
    const handleEditarEvento = () => setActiveComponent('editar');

    const handleToggleComponent = (action) => {
        if (action === 'editar') {
            setActiveComponent('editar');
        } else if (action === 'eliminar') {
            // Agrega aquí la lógica para eliminar la Evento
        }
    };

    if (!finishLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header
                onMostrarEventoss={handleMostrarEvento}
                onEditarEventos={handleEditarEvento}
                onMostrarDesempleado={() => {
                    navigate('/usuario', { state: { valor: 'desempleado' } });
                }}
                onMostrarEmpresa={() => {
                    navigate('/usuario', { state: { valor: 'empresa' } });
                }}
                onMostrarEvento={() => {
                    navigate('/usuario', { state: { valor: 'evento' } });
                }}
                onMostrarUsuarios={() => {
                    navigate('/usuario', { state: { valor: 'usuarios' } });
                }}
                onMostrarOfertas={() => {
                    navigate('/usuario', { state: { valor: 'ofertas' } });
                }}
                onMostrarEventos={() => {
                    navigate('/usuario', { state: { valor: 'evento' } });
                }}
                onMostrarPerfil={() => {
                    navigate('/usuario', { state: { valor: 'perfil' } });
                }}
            />
            {userType === 'Desempleado' && (
                <>
                    {activeComponent === 'visualizar' && <EventoVisualizacion eventoId={idEvento} userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'Empresa' && (
                <div>
                    <div style={{ position: 'fixed', left: '3%', transform: 'translate(-50%, 50%)', zIndex: '1000' }}>
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        icon={<EditIcon />}
                    >
                        <SpeedDialAction
                            key="Editar"
                            icon={<EditIcon />}
                            tooltipTitle="Editar"
                            onClick={() => handleToggleComponent('editar')}
                        />
                        <SpeedDialAction
                            key="Eliminar"
                            icon={<DeleteIcon />}
                            tooltipTitle="Eliminar"
                            onClick={() => handleToggleComponent('eliminar')}
                        />
                        <SpeedDialAction
                            key="Eliminar"
                            icon={<RemoveRedEyeIcon />}
                            tooltipTitle="Visualizar"
                            onClick={() => handleToggleComponent('visualizar')}
                        />
                    </SpeedDial>
                    </div>
                    <div>
                        {activeComponent === 'visualizar' && <EventoVisualizacion eventoId={idEvento} userId={userId} userType={userType} />}
                        {activeComponent === 'editar' && <EventoEdicion eventoId={idEvento} userId={userId} userType={userType} />}
                    </div>
                </div>
            )}
        </>
    );
};

export default Evento;

