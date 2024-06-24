import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Inicio from '../../components/Inicio.component';
import OfertaEdicion from './Componentes/OfertaEdicion.componente';
import OfertaVisualizacion from './Componentes/OfertaVisualizacion.componente';
import Header from '../../components/Header2.component';
import { Snackbar, Alert  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


export const Oferta = () => {
    const { idOferta } = useParams();
    const [userData, setUserData] = useState({});
    const [userType, setUserType] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [finishLoading, setFinishLoading] = useState(false);
    const [activeComponent, setActiveComponent] = useState('visualizar');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
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

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta/${idOferta}`,
            method: 'GET'
        })
            .then(res => {
                setIsOwner(res.data.Empresa === userId);
            })
            .catch(err => console.log(err));
    }, [userId]);

    const handleMostrarOferta = () => setActiveComponent('visualizar');
    const handleEditarOferta = () => setActiveComponent('editar');

    const deleteOferta = async (idOferta, userId) => {
        try {
            axios({
                ...axiosConfig,
                url: `http://localhost:8000/oferta/${idOferta}`,
                method: 'DELETE',
                data: {
                    userId: userId,
                }
            })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                navigate(-1);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                }
            });
        } catch (error) {
            console.error('Error al eliminar la oferta:', error.message);
        }
    };

    const handleToggleComponent = (action, idOferta, userId) => {
        if (action === 'editar') {
            setActiveComponent('editar');
        } else if (action === 'eliminar') {
            const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta oferta?');
            if (confirmed) {
                deleteOferta(idOferta, userId);
            }
        } else if (action === 'visualizar') {
            setActiveComponent('visualizar');
        }
    };


    return (
        !!finishLoading ?

        <>
            <Header
                onMostrarOferta={handleMostrarOferta}
                onEditarOferta={handleEditarOferta}
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
                    {activeComponent === 'visualizar' && <OfertaVisualizacion ofertaId={idOferta} userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'Empresa' && !isOwner && (
                <>
                    {activeComponent === 'visualizar' && <OfertaVisualizacion ofertaId={idOferta} userId={userId} userType={userType} />}
                </>
            )}
            {userType === 'Empresa' && isOwner && (
                <div>
                    <div style={{ position: 'fixed', right: '3%', bottom: '3%', zIndex: '1000' }}>
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
                                onClick={() => handleToggleComponent('eliminar', idOferta, userId)}
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
                        {activeComponent === 'visualizar' && <OfertaVisualizacion ofertaId={idOferta} userId={userId} userType={userType} />}
                        {activeComponent === 'editar' && <OfertaEdicion ofertaId={idOferta} userId={userId} userType={userType} />}
                    </div>
                </div>
            )}
        </>
        :
        <Snackbar
            open={!finishLoading}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => !!userData && !!userType ? navigate('/usuario') : navigate('/')}>
            <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
    );
};

export default Oferta;
