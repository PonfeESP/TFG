import * as React from 'react';
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import './PaginaDesempleadoHome.css'; // Importa el componente
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const PaginaDesempleadoHome = ({ userId }) => {

    return (
        <div>
            <Paper className="paper-style">
                <Typography variant="h4" align="center">¡Bienvenido, {userId}!</Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Link to="ofertas" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Ofertas</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Link to="eventos" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Eventos</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Link to="empresas" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Empresas</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={4}>
                    <Link to="ofertas_Interesado" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Mis Ofertas</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Link to="eventos_Interesado" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Mis Eventos</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Link to="modificacion" className="link-style">
                        <Card className="grid-item-style">
                            <CardContent>
                                <Typography variant="h6" align="center">Modificar Usuario</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}

export default PaginaDesempleadoHome;
