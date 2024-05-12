import * as React from 'react';
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import './PaginaDesempleadoHome.css'; // Importa el componente
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const paperStyle = {
    padding: '20px',
    minHeight: '500px',
    height: '100%',
    backgroundColor: 'white',
    color: 'black',
};

const welcomeStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    marginBottom: '20px',
};

const linkStyle = {
    textDecoration: 'none', // Eliminar el subrayado de los enlaces
};

const gridItemStyle = {
    border: '1px solid #ccc', // Añadir un borde a cada Grid item
    borderRadius: '5px', // Redondear los bordes
};

export const PaginaDesempleadoHome = ({ userId }) => {

    return (
        <div>
        {/* Primer Div - Bienvenido */}
        <Paper sx={{ ...paperStyle, ...welcomeStyle }}>
            <Typography variant="h4" align="center">¡Bienvenido, {userId}!</Typography>
        </Paper>

        {/* Segundo Div - Botones */}
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <Link to="ofertas" style={linkStyle}>
                    <Card sx={gridItemStyle}>
                        <CardContent>
                            <Typography variant="h6" align="center">Ofertas</Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Link to="eventos" style={linkStyle}>
                    <Card sx={gridItemStyle}>
                        <CardContent>
                            <Typography variant="h6" align="center">Eventos</Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Link to="empresas" style={linkStyle}>
                    <Card sx={gridItemStyle}>
                        <CardContent>
                            <Typography variant="h6" align="center">Empresas</Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
        </Grid>

        {/* Tercer Div - Enlaces */}
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <Link to="ofertas_Interesado" style={linkStyle}>
                    <Card sx={gridItemStyle}>
                        <CardContent>
                            <Typography variant="h6" align="center">Mis Ofertas</Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Link to="eventos_Interesado" style={linkStyle}>
                    <Card sx={gridItemStyle}>
                        <CardContent>
                            <Typography variant="h6" align="center">Mis Eventos</Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Link to="modificacion" style={linkStyle}>
                    <Card sx={gridItemStyle}>
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
