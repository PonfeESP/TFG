import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, Button, Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Stack, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { blueGrey } from '@mui/material/colors';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function UsersCard({ user }) {
    const [expanded, setExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const color = blueGrey[200];

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/desempleado/${business._id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ maxWidth: 750 }}>
            <CardHeader
                avatar={
                    user.FotoPerfil ? (
                      <Avatar aria-label="business" src={`http://localhost:8000/profileImages/${user.FotoPerfil}` } />
                    ) : (
                      <Avatar aria-label="business" >
                        {`${user.Nombre.charAt(0).toUpperCase()}`}
                      </Avatar>
                    )
                  }
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                title={user.Nombre}
                subheader={`Edad: ${user.Edad}, Experiencia Laboral: ${user.Experiencia_Laboral}`}
            />
            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <Link to={`/usuario/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Button variant="text" sx={{ width: '100%' }}>
                            Ver Perfil
                        </Button>
                    </Link>
                </MenuItem>
            </Menu>
            <CardContent>
                <Stack direction="row" spacing={1}>
                    {user.Tags.map((tag, index) => (
                        <Chip key={`${tag.Lenguaje}-${user._id}-${index}`} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} color="primary" variant="outlined" sx={{ margin: 7 }} />
                    ))}
                </Stack>
            </CardContent>
            <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button variant="text" onClick={handleShare}>
                    <ShareIcon sx={{ mr: 1 }} />
                    Compartir
                </Button>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{user.Descripcion}</Typography>
                    <Typography paragraph>{user.Estudios}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
