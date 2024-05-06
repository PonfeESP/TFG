import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaOfertaDesempleado = () => {
    const { idOferta } = useParams();
    const [oferta, setOferta] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [isRegistrado, setIsRegistrado] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tagsCoincidentes, setTagsCoincidentes] = useState([]);
    const [porcentajeCoincidencia, setPorcentajeCoincidencia] = useState({});

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
                }
            })
            .catch(err => console.log(err));
    }, [idOferta, userData.id]);

    useEffect(() => {
        if (oferta && userData.id) {
            const tagsUsuario = oferta.Tags_Usuario.map(tag => ({ nombre: tag.Lenguaje, puntuacion: tag.Puntuacion }));
            const tagsOferta = oferta.Tags.map(tag => ({ nombre: tag.Lenguaje, puntuacion: tag.Puntuacion }));

            const coincidencias = tagsOferta.map(tagOferta => {
                const tagUsuario = tagsUsuario.find(tag => tag.nombre === tagOferta.nombre);
                if (tagUsuario) {
                    const porcentaje = (tagUsuario.puntuacion / tagOferta.puntuacion) * 100;
                    return { nombre: tagOferta.nombre, porcentaje };
                }
                return null;
            }).filter(Boolean);

            const coincidenciaState = {};
            coincidencias.forEach(coincidencia => {
                coincidenciaState[coincidencia.nombre] = coincidencia.porcentaje;
            });
            setPorcentajeCoincidencia(coincidenciaState);
        }
    }, [oferta, userData.id]);

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
            <div style={{ marginRight: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginBottom: '4px' }}>{tag}</Typography>
                <div style={{ backgroundColor: '#2E8B57', width: '20px', height: '200px', borderRadius: '4px', position: 'relative', alignSelf: 'flex-start' }}>
                    <div style={{ backgroundColor: '#00FF00', width: '100%', height: `${percentage}%`, borderRadius: '4px' }}></div>
                </div>
            </div>
        );
    };



    const handleClose = () => {
        setConfirmOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {oferta && (
                <>
                    <Typography variant="h4">{oferta.Nombre}</Typography>
                    <Typography variant="body1">Descripción: {oferta.Descripcion}</Typography>
                    <Typography variant="body1">Empresa: {oferta.Empresa.Nombre}</Typography>
                    <Typography variant="body1">Disponible: {oferta.Disponible ? 'Sí' : 'No'}</Typography>
                    <Typography variant="h5">Tags de la oferta:</Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {oferta.Tags_Usuario.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={`${tag.Lenguaje}: ${tag.Puntuacion}`}
                                        style={{ margin: '4px' }}
                                        variant="outlined"
                                    />
                                ))}
                            </div>
                            <Typography variant="h5">Tags coincidentes:</Typography>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {tagsCoincidentes.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        style={{ margin: '4px' }}
                                        variant="outlined"
                                    />
                                ))}
                            </div>
                            <Typography variant="body1">Porcentaje de concordancia: {oferta.Porcentaje_Concordancia}%</Typography>
                        </>
                    )}
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

                    <Modal
                        open={confirmOpen}
                        onClose={handleClose}
                        aria-labelledby="modal-confirm-title"
                        aria-describedby="modal-confirm-description"
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

                    {/* Nueva sección para mostrar porcentaje de coincidencia de tags */}
                    <Typography variant="h5">Porcentaje de coincidencia por tag:</Typography>
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                        {Object.entries(porcentajeCoincidencia).map(([tag, porcentaje], index) => (
                            <TagProgressBar key={index} tag={tag} percentage={porcentaje} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PaginaOfertaDesempleado;
