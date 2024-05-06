import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import Uno from '../../../Imagenes/uno.png';
import Dos from '../../../Imagenes/dos.png';
import Tres from '../../../Imagenes/tres.png';
import PaginaDesempleadoOrdenada from './PaginaDesempleadoOrdenada'; // Importa el componente
import './PaginaDesempleadoHome.css'; // Importa el componente
import { Link } from 'react-router-dom'; // Import the Link component


const paperStyle = {
    padding: '20px',
    minHeight: '500px', // Altura mínima de cada sección
    height: '100%', // El papel ocupa toda la altura de su contenedor
    backgroundColor: 'white', // Fondo blanco
    color: 'black', // Texto negro
};

const EventoResumen = ({ evento, onEventoSeleccionado }) => {
    const handleClick = () => {
        onEventoSeleccionado(evento);
    };

    return (
        <div className="evento-resumen" onClick={handleClick} style={{ marginBottom: '10px', writingMode: 'vertical-lr', textOrientation: 'mixed', maxWidth: '50px', maxHeight: '200px', display: 'inline-block', overflow: 'hidden' }}>
            <Typography variant="h6" style={{ marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evento.Nombre}</Typography>
            {/* Agrega aquí más detalles que desees mostrar en el resumen */}
        </div>
    );
};



export const PaginaDesempleadoHome = ({ userId }) => {
    const [ofertas, setOfertas] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/ofertas',
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_ordenadas/${userId}`,
            method: 'GET'
        })
            .then(res => {
                const data = res.data.slice(0, 3);
                setOfertas(data);
                setSelectedOferta(res.data[0]);
            })
            .catch(err => console.error("Error fetching data:", err))
    }, []);

    const handleOfertaClick = (oferta) => {
        setSelectedOferta(oferta);
    };

    const renderOfertas = () => {
        const podioOfertas = ofertas.slice(0, 3);

        return (
            <div className="ofertas-wrapper">
                <div className="ofertas-left">
                    <Paper className="details-paper">
                        {selectedOferta ? (
                            <div className="details" style={{ maxWidth: '100%' }}>
                                <Link to={`/oferta/${selectedOferta._id}`} style={{ textDecoration: 'none' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        {selectedOferta.Nombre}
                                    </Typography>
                                </Link>
                                <Typography>{selectedOferta.Descripcion}</Typography>
                                <Typography>Empresa: {selectedOferta.Empresa.Nombre}</Typography>
                                <Typography>Porcentaje: {selectedOferta.PorcentajeConcordancia}</Typography>
                            </div>
                        ) : (
                            <Typography variant="h6">Select an oferta from the podium</Typography>
                        )}
                    </Paper>
                </div>
                <div className="ofertas-right" style={{ backgroundColor: 'white', backgroundSize: 'cover', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'gray', margin: '1px 0' }}>
                        R A N K I N G
                    </Typography>
                    <Paper className="podium-paper" style={{ backgroundColor: 'white', backgroundSize: 'cover' }}>
                        <div className="ofertas-container" style={{ marginTop: "40px" }}>
                            {podioOfertas.map((oferta, index) => (
                                <div key={index} className={`box box-${5 - index}`} style={{ backgroundImage: `url(${index === 0 ? Uno : index === 1 ? Dos : Tres})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', bottom: `${index * 25}%` }} onClick={() => handleOfertaClick(oferta)}>
                                    <div style={{ marginTop: "170px" }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                            {oferta.Nombre}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Porcentaje: {oferta.PorcentajeConcordancia} %</Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Paper>
                </div>
            </div>

        );
    };

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/eventos',
            method: 'GET'
        })
            .then(res => {
                const shuffledEvents = res.data.sort(() => 0.5 - Math.random());
                setEventos(shuffledEvents);
                // Establecer el primer evento aleatorio por defecto
                if (shuffledEvents.length > 0) {
                    setEventoSeleccionado(shuffledEvents[0]);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleEventoSeleccionado = (evento) => {
        setEventoSeleccionado(evento);
    };

    return (
        <div>
            <Paper style={paperStyle}>
                <div className="papers-container">
                    {renderOfertas()}
                </div>
            </Paper>
            <Paper style={{ ...paperStyle, backgroundColor: 'black', display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', width: '100%', backgroundColor: 'yellow' }} className="eventos-resumen-contenedor">
                    <div style={{ flex: '1 1 60%', padding: '10px', width: '100%', display: 'flex', flexDirection: 'column'}} className="eventos-resumen-izquierda">
                        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                            <Typography variant="h4" gutterBottom>
                                Detalles del Evento
                            </Typography>
                            {eventoSeleccionado && (
                                <div>
                                    <Typography variant="h6">{eventoSeleccionado.Nombre}</Typography>
                                    <Typography>{eventoSeleccionado.Descripcion}</Typography>
                                    <Typography>Fecha: {eventoSeleccionado.Fecha}</Typography>
                                    {/* Mostrar más detalles aquí */}
                                </div>
                            )}
                        </Paper>
                    </div>
                    <div style={{ flex: '1 1 40%', padding: '10px', width: '100%', display: 'flex', flexDirection: 'column' }} className="eventos-resumen-derecha">
                        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                            <div className="eventos-resumen-container" style={{ marginLeft: '5%'}}>
                                {eventos.slice(0, 8).map(evento => (
                                    <EventoResumen
                                    key={evento._id}
                                    evento={evento}
                                    onEventoSeleccionado={handleEventoSeleccionado}
                                />
                                ))}
                            </div>
                        </Paper>
                    </div>
                </div>
            </Paper>
            <Paper style={{ ...paperStyle, backgroundColor: '#933' }}>
                {/* Contenido de la tercera sección */}
            </Paper>
        </div>
    );
}

export default PaginaDesempleadoHome;
