import * as React from 'react';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tooltip, Paper, Box, CircularProgress, LinearProgress, Stack, Badge, Chip, Button, Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import {blueGrey} from '@mui/material/colors';
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

const getColor = pc => {
    const pt = Number(pc);
    return pt > 55 
        ? 'green'
        : pt < 55 && pt > 15
            ? 'orange'
            : 'red'
}

const getString = pc => {
    const pt = Number(pc);
    return pt > 55
        ? `¡Concordancia alta! Tienes un ${pc} % de afinidad`
        : pt < 55 && pt > 15
            ? `Concordancia media, podrías encajar muy bien con tu ${pc} de afinidad`
            : `Concordancia baja, aprende algo nuevo para subir tu ${pc} de afinidad`;
}
export default function OfferCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const color = blueGrey[200];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const oferta = props.props;
  let affinityPercentage = Number(oferta.PorcentajeConcordancia);

  if (isNaN(affinityPercentage)) affinityPercentage = 0;

  return (
    <Card sx={{ maxWidth: 750 }}>
      <CardHeader
        avatar={
          <Paper elevation={10} sx={{ position: 'relative', display: 'inline-flex', borderRadius: 50, backgroundColor: color }}>
          <CircularProgress size="3rem" color="success" thickness={5} variant="determinate" value={affinityPercentage} />
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
            <Typography variant="text-body2" component="div" color="text.secondary" sx={{fontWeight: 'bold'}}>
              {`${Math.round(affinityPercentage)}%`}
            </Typography>
          </Box>
        </Paper>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={oferta.Nombre}
        subheader={`Publicada el ${dayjs(oferta["Fecha_Creacion"]).format("DD/MM/YYYY")} por ${oferta.Empresa.Nombre}`}
      />
      <CardContent>  
        <Stack direction="row" spacing={1}>

          {
            oferta.Tags.map(tag => {
              return (          <Chip label={tag.Lenguaje} color="primary" variant="outlined" sx={{margin: 7}} />
            )
            })
          }
      </Stack>
      </CardContent>
      <CardActions sx={{              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',}}>
      <Button variant="text">          <ShareIcon sx={{mr: 1}} />
 Compartir</Button>
      <Button variant="contained">          <FavoriteIcon sx={{mr: 1}} />
 Me interesa</Button>

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
          <Typography paragraph>{oferta.Descripcion}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}