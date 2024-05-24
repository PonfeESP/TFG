import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tooltip, Menu, MenuItem, Paper, Box, CircularProgress, LinearProgress, Stack, Badge, Chip, Button, Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@mui/material';
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


export default function EventCard({ event, userId }) {
  const [expanded, setExpanded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInterested, setIsInterested] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const color = blueGrey[200];

  useEffect(() => {
    setIsInterested(event.Interesados.includes(userId));
  }, [event.Interesados, userId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/evento/${event._id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el enlace: ', err);
    });
  };

  const handleInterest = () => {
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/solicitud_evento',
      method: 'PUT',
      data: {
        userId: userId,
        eventId: event._id
      }
    })
      .then(res => {
        console.log('Solicitud enviada con éxito');
        setIsRegistered(true);
        setIsInterested(true); // Actualizar el estado para reflejar el interés del usuario
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
        }
      });
  };

  const handleDisinterest = () => {
    axios({
      ...axiosConfig,
      url: `http://localhost:8000/solicitud_evento/${event._id}`,
      method: 'DELETE',
      data: {
        userId: userId,
      }
    })
      .then(res => {
        console.log('Usuario eliminado de la lista de interesados con éxito');
        setIsRegistered(false);
        setIsInterested(false); // Actualizar el estado para reflejar el desinterés del usuario
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
        }
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
          <Paper elevation={10} sx={{ position: 'relative', display: 'inline-flex', borderRadius: 50, backgroundColor: color }}>
            <CircularProgress size="3rem" color="success" thickness={5} variant="determinate" value={event.Aforo} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="text-body2" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {`${event.Aforo}%`}
              </Typography>
            </Box>
          </Paper>
        }
        action={
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={event.Nombre}
        subheader={`Fecha: ${dayjs(event.Fecha).format("DD/MM/YYYY")}, Aforo: ${event.Aforo}, Localización: ${event.Localizacion}, Publicada el ${dayjs(event.Fecha_Creacion).format("DD/MM/YYYY")} por ${event.Empresa.Nombre}`}
      />
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link to={`/evento/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant="text" sx={{ width: '100%' }}>
              Explorar
            </Button>
          </Link>
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography paragraph>{event.Descripcion}</Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button variant="text" onClick={handleShare}>
          <ShareIcon sx={{ mr: 1 }} />
          Compartir
        </Button>
        {isInterested ? (
          <Button variant="contained" onClick={handleDisinterest}>
            <FavoriteIcon sx={{ mr: 1 }} />
            No me interesa
          </Button>
        ) : (
          <Button variant="contained" onClick={handleInterest}>
            <FavoriteIcon sx={{ mr: 1 }} />
            Me interesa
          </Button>
        )}

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
          <Typography paragraph>{event.Descripcion}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

