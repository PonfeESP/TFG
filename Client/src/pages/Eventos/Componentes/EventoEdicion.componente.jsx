import React, { useState, useEffect } from 'react';
import {
    Checkbox, Container, Stack, Slider, Switch, Alert, TextField, Typography, IconButton, Box, Grid, Button, Chip, Paper, Drawer, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const Evento = ({ eventoId }) => {

    const [eventoData, setEventoData] = useState(null);
    const [isEditing, setIsEditing] = useState({});
    const [errors, setErrors] = useState({});
    const [confirmChangesDialogOpen, setConfirmChangesDialogOpen] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/eventoUnicoEmpresa/${eventoId}`,
            method: 'GET'
        })
            .then(res => {
                setEventoData(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setErrors('Error al cargar los datos de la evento');
            });
    }, [eventoId]);

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveClick = async (field) => {
        let newErrors = {};
        let hasErrors = false;

        if (!eventoData.Nombre.trim()) {
            newErrors.Nombre = 'El nombre no puede estar vacío.';
            hasErrors = true;
        }

        if (!eventoData.Descripcion.trim()) {
            newErrors.Descripcion = 'La descripción no puede estar vacía.';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios({
                ...axiosConfig,
                url: `http://localhost:8000/evento/${eventoId}`,
                method: 'PUT',
                data: eventoData
            });
            setEventoData(res.data);
            handleEditClick(field);
        } catch (err) {
            console.error("Error updating data:", err);
            setErrors('Error al actualizar los datos de la evento');
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setEventoData(prevEventoData => ({
            ...prevEventoData,
            [field]: value
        }));
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    };

    const handleConfirmChanges = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/evento/${eventoId}`,
            method: 'PUT',
            data: eventoData
        })
            .then(res => {
                console.log("Cambios guardados en la evento:", res.data);
                setConfirmChangesDialogOpen(false);
            })
            .catch(err => {
                console.error("Error al guardar cambios en la evento:", err);
            });
    };

    if (!eventoData) return <div>Loading...</div>;
    console.log("Evento", eventoData)

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Editar Evento
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="Nombre"
                            type="text"
                            value={eventoData.Nombre}
                            onChange={(e) => handleChange(e, 'Nombre')}
                            disabled={!isEditing.Nombre}
                            variant="outlined"
                            margin="normal"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                const isLetter = /^[a-zA-Z\s]$/;
                                if (!isLetter.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={!!errors.Nombre}
                            helperText={errors.Nombre}
                        />
                        <IconButton onClick={() => isEditing.Nombre ? handleSaveClick('Nombre') : handleEditClick('Nombre')}>
                            {isEditing.Nombre ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            label="Descripción"
                            name="Descripcion"
                            type="text"
                            value={eventoData.Descripcion}
                            onChange={(e) => handleChange(e, 'Descripcion')}
                            disabled={!isEditing.Descripcion}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.Descripcion}
                            helperText={errors.Descripcion}
                        />
                        <IconButton onClick={() => isEditing.Descripcion ? handleSaveClick('Descripcion') : handleEditClick('Descripcion')}>
                            {isEditing.Descripcion ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    </Box>
                </Grid>

            </Grid>

        </Container>
    );
};

export default Evento;
