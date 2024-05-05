import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaDesempleadoOrdenada.css';
import Ranking from '../../../Imagenes/Ranking.png';
import Uno from '../../../Imagenes/uno.png';
import Dos from '../../../Imagenes/dos.png';
import Tres from '../../../Imagenes/tres.png';
import { Link } from 'react-router-dom'; // Import the Link component

export const PaginaDesempleadoOrdenada = ({ userId, maxOfertas }) => {
    const [ofertas, setOfertas] = useState([]);
    const [selectedOferta, setSelectedOferta] = useState(null);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_ordenadas/${userId}`,
            method: 'GET'
        })
            .then(res => {
                const data = maxOfertas ? res.data.slice(0, maxOfertas) : res.data;
                setOfertas(data);
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
                            <div className="details" style={{ maxWidth: '40%' }}>
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
                <div className="ofertas-right">
                    <Paper className="podium-paper" style={{ backgroundImage: `url(${Ranking})`, backgroundSize: 'cover' }}>
                        <div className="ofertas-container" style={{ marginTop: "120px" }}>
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



    const restantes = ofertas.slice(3);
    const mostrarTabla = restantes.length > 0;

    const getColor = (index) => {
        const colors = ['#ff5733', '#33ff57', '#5733ff', '#ff5733', '#33ff57'];
        return colors[index];
    };

    return (
        <div>
            <div className="papers-container">
                {renderOfertas()}
            </div>
            {mostrarTabla && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Porcentaje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restantes.map((oferta, index) => (
                                <TableRow key={index}>
                                    <TableCell>{oferta.Nombre}</TableCell>
                                    <TableCell>{oferta.Descripcion}</TableCell>
                                    <TableCell>{oferta.Empresa.Nombre}</TableCell>
                                    <TableCell>{oferta.PorcentajeConcordancia}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default PaginaDesempleadoOrdenada;
