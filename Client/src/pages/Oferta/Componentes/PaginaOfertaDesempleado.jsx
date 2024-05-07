import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaOfertaDesempleado.css'; // Importar el archivo CSS

export const PaginaOfertaDesempleado = () => {
    const { idOferta } = useParams();
    const [oferta, setOferta] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [isRegistrado, setIsRegistrado] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [porcentajeCoincidencia, setPorcentajeCoincidencia] = useState({});
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsSmallScreen(mediaQuery.matches);

        const handleScreenChange = (e) => {
            setIsSmallScreen(e.matches);
        };

        mediaQuery.addEventListener('change', handleScreenChange);

        return () => {
            mediaQuery.removeEventListener('change', handleScreenChange);
        };
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Desempleado');
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas/${idOferta}?usuarioId=${userData.id}`,
            method: 'GET',
        })
            .then(res => {
                setOferta(res.data);
                if (res.data && userData.id) {
                    setIsRegistrado(res.data.Interesados.includes(userData.id));
                    setPorcentajeCoincidencia(res.data.Porcentaje_Concordancia_Tag);
                }
            })
            .catch(err => console.log(err));
    }, [idOferta, userData.id]);

    const handleInteresado = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/solicitud_oferta',
            method: 'PUT',
            data: {
                userId: userId,
                ofertaId: idOferta
            }
        })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                setIsRegistrado(true);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                }
            })
            .finally(() => {
                setConfirmOpen(false);
            });
    };

    const handleCancelarInteres = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/retirar_solicitud_oferta/${idOferta}`,
            method: 'DELETE',
            data: {
                userId: userId,
            }
        })
            .then(res => {
                console.log('Interés cancelado con éxito');
                setIsRegistrado(false);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al cancelar el interés. Por favor, inténtelo de nuevo.');
                }
            });
    };

    // Componente actualizado para mostrar barras de progreso verticales y limitar su altura
    const TagProgressBar = ({ tag, percentage }) => {
        return (
            <div class="contenedor-derecha">
                <Typography variant="body1" style={{ marginBottom: '4px' }}>{tag}</Typography>
                <div class="cosa1">
                    <div className="cosa2" style={{ height: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    const handleClose = () => {
        setConfirmOpen(false);
    };


    return (
        <div>
            <div className={isSmallScreen ? "pagina pagina-columna" : "pagina pagina-fila"}>
                <div className={isSmallScreen ? "componente-izquierda small-screen" : "componente-izquierda"}>
                    <div style={{ backgroundColor: 'transparent' }}>
                        {oferta && (
                            <>
                                <div className="campo">
                                    <Typography variant="h4">{oferta.Nombre}</Typography>
                                </div>
                                <div className="campo">
                                    <Typography variant="body1">Descripción: {oferta.Descripcion}</Typography>
                                </div>
                                <div className="campo">
                                    <Typography variant="body1">Empresa: {oferta.Empresa.Nombre}</Typography>
                                </div>
                                <div className="campo">
                                    <Typography variant="body1">Disponible: {oferta.Disponible ? 'Sí' : 'No'}</Typography>
                                </div>
                                <Typography variant="h5">Tags de la oferta:</Typography>
                                <div className="tags">
                                    {oferta.Tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={`${tag.Lenguaje}: ${tag.Puntuacion}`}
                                            style={{ margin: '4px' }}
                                            variant="outlined"
                                        />
                                    ))}
                                </div>
                                {userData.id && (
                                    <>
                                        <Typography variant="h5">Tags del usuario:</Typography>
                                        <div className="tags">
                                            {oferta.Tags_Usuario.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={`${tag.Lenguaje}: ${tag.Puntuacion}`}
                                                    style={{ margin: '4px' }}
                                                    variant="outlined"
                                                />
                                            ))}
                                        </div>
                                        <Typography variant="body1">Porcentaje de concordancia: {oferta.Porcentaje_Concordancia}%</Typography>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="componente-derecha">
                    {/* Nueva sección para mostrar porcentaje de coincidencia de tags */}
                    <Typography variant="h5">Porcentaje de coincidencia por tag:</Typography>
                    <div className="barras">
                        {Object.entries(porcentajeCoincidencia).map(([tag, porcentaje], index) => (
                            <TagProgressBar key={index} tag={tag} percentage={porcentaje} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="boton-interesado">
                {isRegistrado ? (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCancelarInteres}
                    >
                        Cancelar Interés
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleInteresado}
                    >
                        Interesado
                    </Button>
                )}
            </div>
            <div>
                <Modal
                    open={confirmOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-confirm-title"
                    aria-describedby="modal-confirm-description"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2 }}>
                        <Typography id="modal-confirm-title" variant="h6" component="h2" gutterBottom>
                            ¿Está seguro de que quiere solicitar esta oferta?
                        </Typography>
                        <Button onClick={handleConfirm} variant="contained" color="primary">Confirmar</Button>
                        <Button onClick={handleClose} variant="outlined" color="secondary">Cancelar</Button>
                        {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                        )}
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default PaginaOfertaDesempleado;
