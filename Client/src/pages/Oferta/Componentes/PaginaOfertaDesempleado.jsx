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
    const [resalto, setResalto] = useState(null); // Nuevo estado para el tag resaltado


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

    function calcularColor(porcentaje) {
        const valor = porcentaje / 100;
        const colorInicio = [255, 0, 0]; // Rojo
        const colorFin = [0, 255, 0]; // Verde

        const colorIntermedio = colorInicio.map((c, i) => Math.round(c + (colorFin[i] - c) * valor));

        return `rgba(${colorIntermedio.join(',')}, 1)`;
    }

    const auxResaltar = (tag) => {
        setResalto(tag);
    };

    const auxNoResaltar = () => {
        setResalto(null);
    };

    // Componente actualizado para mostrar barras de progreso verticales y limitar su altura
    const TagProgressBar = ({ tag, percentage }) => {
        const displayPercentage = Math.min(percentage, 100);

        return (
            <div
                className="tag-progress-container"
                onMouseEnter={() => auxResaltar(tag)} // Agrega el manejador de evento onMouseEnter
                onMouseLeave={auxNoResaltar} // Agrega el manejador de evento onMouseLeave
            >
                <div className="bar-container">
                    <Typography variant="subtitle1" className="tag-name">{tag}</Typography> {/* Muestra el nombre del tag */}
                    <div className="cosa1">
                        <div className="cosa2" style={{ width: `${displayPercentage}%` }} />
                    </div>
                </div>
            </div>
        );
    };

    const handleClose = () => {
        setConfirmOpen(false);
    };


    return (
        <div className="global">
            {oferta && (
                <>
                    <div className="nombre">
                        <Typography variant="h4">{oferta.Nombre}</Typography>
                    </div>
                    <div className={isSmallScreen ? "pagina pagina-columna" : "pagina pagina-fila"}>
                        <div className={isSmallScreen ? "componente-izquierda small-screen" : "componente-izquierda"}>
                            <div style={{ backgroundColor: 'transparent' }}>
                                <div className="campo">
                                    <Typography variant="body1">{oferta.Descripcion}</Typography>
                                </div>
                                <div className="campo">
                                    <Typography variant="body1">{oferta.Empresa.Nombre}</Typography>
                                </div>
                                <Typography variant="h5">Tags de la oferta:</Typography>
                                <div className="tags">
                                    {oferta.Tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={`${tag.Lenguaje}: ${tag.Puntuacion}`}
                                            style={{ margin: '4px' }}
                                            variant="outlined"
                                            className={resalto === tag.Lenguaje ? 'highlighted-tag' : ''}
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
                                        <div className="porcentaje-concordancia" style={{ backgroundColor: calcularColor(oferta.Porcentaje_Concordancia) }}>
                                            <Typography variant="body1" >
                                                Porcentaje de concordancia: {oferta.Porcentaje_Concordancia.toFixed(2)}%
                                            </Typography>
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>
                        <div className="componente-derecha" >
                            <div className="concordancia">
                                <Typography variant="h5">Concordancia</Typography>
                                <div className="barras">
                                    {Object.entries(porcentajeCoincidencia).map(([tag, porcentaje], index) => (
                                        <TagProgressBar key={index} tag={tag} percentage={porcentaje} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
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
    );

}

export default PaginaOfertaDesempleado;
