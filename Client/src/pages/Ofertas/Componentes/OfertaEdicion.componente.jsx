import React, { useState, useEffect } from 'react';
import {
    Checkbox, Container, Stack, Slider, Autocomplete, Alert, TextField, Typography, IconButton, Box, Grid, Button, Chip, Paper, Drawer, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const Oferta = ({ ofertaId }) => {

    const [ofertaData, setOfertaData] = useState(null);
    const [isEditing, setIsEditing] = useState({});
    const [errors, setErrors] = useState({});
    const [tagsList, setTagsList] = useState([]);
    const [newTag, setNewTag] = useState({ Lenguaje: '', Puntuacion: 1 });
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [editTagDialogOpen, setEditTagDialogOpen] = useState(false);
    const [editedTag, setEditedTag] = useState(null);
    const [confirmChangesDialogOpen, setConfirmChangesDialogOpen] = useState(false);
    const [isAddingTagFormOpen, setIsAddingTagFormOpen] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [tagAlreadyExistsError, setTagAlreadyExistsError] = useState(false);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta_empresa/${ofertaId}`,
            method: 'GET'
        })
            .then(res => {
                setOfertaData(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setErrors('Error al cargar los datos de la oferta');
            });
    }, [ofertaId]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/tags`,
            method: 'GET'
        })
            .then(res => {
                setTagsList(res.data);
            })
            .catch(err => {
                console.error("Error fetching tags:", err);
                setErrors('Error al cargar los tags');
            });
    }, []);

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveClick = async (field) => {
        let newErrors = {};
        let hasErrors = false;

        if (!ofertaData.Nombre.trim()) {
            newErrors.Nombre = 'El nombre no puede estar vacío.';
            hasErrors = true;
        }

        if (!ofertaData.Descripcion.trim()) {
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
                url: `http://localhost:8000/oferta/${ofertaId}`,
                method: 'PUT',
                data: ofertaData
            });
            setOfertaData(res.data);
            handleEditClick(field);
        } catch (err) {
            console.error("Error updating data:", err);
            setErrors('Error al actualizar los datos de la oferta');
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setOfertaData(prevOfertaData => ({
            ...prevOfertaData,
            [field]: value
        }));
    };

    const toggleTagsDrawer = () => {
        setIsTagsDrawerOpen(!isTagsDrawerOpen);
    };


    const toggleAddingTagForm = () => {
        setIsAddingTagFormOpen(!isAddingTagFormOpen);
    };

    const handleEditTag = (tag) => {
        setEditedTag(tag);
        setEditTagDialogOpen(true);
    };

    const handleCloseEditTagDialog = () => {
        setEditTagDialogOpen(false);
    };

    const handleSaveEditTag = () => {
        if (editedTag.Puntuacion < 1 || editedTag.Puntuacion > 5) {
            alert('La puntuación debe estar entre 1 y 5');
            return;
        }
        setOfertaData((prev) => ({
            ...prev,
            Tags: prev.Tags.map(tag => tag.Lenguaje === editedTag.Lenguaje ? editedTag : tag)
        }));
        setEditTagDialogOpen(false);
    };

    const handleDeleteTag = (tag) => {
        setOfertaData((prev) => ({
            ...prev,
            Tags: prev.Tags.filter(t => t.Lenguaje !== tag.Lenguaje)
        }));
    };

    const handleTagChange = (e, value) => {
        if (!value) return;
        const tagExists = ofertaData.Tags.some(tag => tag.Lenguaje === value.Lenguaje);
        if (tagExists) {
            setErrors('Este tag ya está registrado para el usuario');
        } else {
            setNewTag(value);
        }
    };

    const handleAddNewTag = () => {
        if (!newTag.Lenguaje || newTag.Puntuacion < 1 || newTag.Puntuacion > 5) {
            setErrors('Por favor, complete todos los campos adecuadamente');
            setOpenErrorDialog(true);
            return;
        }
        const tagExists = ofertaData.Tags.some(tag => tag.Lenguaje === newTag.Lenguaje);
        if (tagExists) {
            setTagAlreadyExistsError(true); // Setear el estado de error
            return;
        }
        setOfertaData(prevOfertaData => ({
            ...prevOfertaData,
            Tags: [
                ...prevOfertaData.Tags,
                newTag
            ]
        }));

        setIsAddingTagFormOpen(false);

        setNewTag({ Lenguaje: '', Puntuacion: '' });
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    };

    const handleConfirmChangesTags = () => {

        console.log("opop", ofertaData.Tags)

        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta/${ofertaId}`,
            method: 'PUT',
            data: { Tags: ofertaData.Tags }
        })
            .then(res => {
                console.log("Cambios guardados en los tags del usuario:", res.data);
                setConfirmChangesDialogOpen(false);
            })
            .catch(err => {
                console.error("Error al guardar cambios en los tags del usuario:", err);
            });
    };


    const handleConfirmChanges = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta/${ofertaId}`,
            method: 'PUT',
            data: ofertaData
        })
            .then(res => {
                console.log("Cambios guardados en la oferta:", res.data);
                setConfirmChangesDialogOpen(false);
            })
            .catch(err => {
                console.error("Error al guardar cambios en la oferta:", err);
            });
    };

    if (!ofertaData) return <div>Loading...</div>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Editar Oferta
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="Nombre"
                            type="text"
                            value={ofertaData.Nombre}
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
                            value={ofertaData.Descripcion}
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
                <Grid item xs={12}>
                    <Box mb={2} textAlign="center">
                        <Typography variant="h5" gutterBottom textAlign={'center'}>
                            Tags de la Oferta
                        </Typography>
                        <div style={{ alignSelf: 'center' }}>
                            <Stack direction="row" spacing={1} justifyContent="center">
                                {ofertaData.Tags.map(tag => (
                                    <Chip key={tag.Lenguaje} label={`${tag.Lenguaje} (${tag.Puntuacion})`} color="primary" variant="outlined" sx={{ margin: 7 }} />
                                ))}
                            </Stack>
                        </div>
                        <IconButton size="large" onClick={toggleTagsDrawer}>
                            <EditIcon fontSize="large" />
                        </IconButton>
                    </Box>
                    <Drawer anchor="right" open={isTagsDrawerOpen} onClose={toggleTagsDrawer}>
                        <Box p={2} width={400}>
                            <Typography variant="h6" gutterBottom textAlign={'center'}>
                                Lista de Tags
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={toggleAddingTagForm}
                                style={{ marginBottom: '10px' }}
                            >
                                Nuevo Tag
                            </Button>
                            <List>
                                {ofertaData.Tags.map((tag, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`${tag.Lenguaje}: ${tag.Puntuacion}`} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleEditTag(tag)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" onClick={() => handleDeleteTag(tag)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setConfirmChangesDialogOpen(true)}
                            >
                                Confirmar Cambios
                            </Button>
                        </Box>
                    </Drawer>
                    <Dialog open={isAddingTagFormOpen} onClose={toggleAddingTagForm}>
                        <Box p={2} width={400}>
                            <Typography variant="h6" gutterBottom marginBottom={'15px'} textAlign={'center'}>
                                Nuevo Tag
                            </Typography>
                            <Box mb={2}>
                                <Autocomplete
                                    options={tagsList.map(tag => ({ label: tag.Nombre }))}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Lenguaje"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    onChange={(event, newValue) => {
                                        if (!newValue) {
                                            setNewTag(prevTag => ({ ...prevTag, Lenguaje: '' }));
                                        } else {
                                            setNewTag(prevTag => ({ ...prevTag, Lenguaje: newValue.label }));
                                        }
                                    }}
                                />
                            </Box>
                            <Box mb={2}>
                                <Slider
                                    value={newTag.Puntuacion}
                                    onChange={(event, newValue) => {
                                        setNewTag(prevTag => ({ ...prevTag, Puntuacion: newValue }));
                                    }}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={5}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddNewTag}
                                style={{ marginTop: '10px' }}
                            >
                                Añadir Tag
                            </Button>

                            <Dialog open={tagAlreadyExistsError} onClose={() => setTagAlreadyExistsError(false)}>
                                <DialogTitle>Error</DialogTitle>
                                <DialogContent>
                                    <Alert severity="error">{'Este tag ya está registrado para el usuario'}</Alert>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setTagAlreadyExistsError(false)} color="primary" autoFocus>
                                        OK
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Dialog>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h6">Disponible</Typography>
                        <Switch
                            checked={ofertaData.Disponible}
                            onChange={(e) => handleChange(e, 'Disponible')}
                            disabled={!isEditing.Disponible}
                        />
                        <IconButton onClick={() => handleEditClick('Disponible')}>
                            {isEditing.Disponible ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setConfirmChangesDialogOpen(true)}
                    >
                        Confirmar cambios
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={confirmChangesDialogOpen} onClose={() => setConfirmChangesDialogOpen(false)}>
                <DialogTitle>Confirmar cambios</DialogTitle>
                <DialogContent>
                    <Typography>¿Está seguro de que desea guardar los cambios?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmChangesDialogOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmChanges} color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Alert severity="error">{errors}</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editTagDialogOpen} onClose={handleCloseEditTagDialog}>
                <DialogTitle>Editar Tag</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Lenguaje"
                        value={editedTag ? editedTag.Lenguaje : ''}
                        disabled
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Puntuación"
                        type="number"
                        value={editedTag ? editedTag.Puntuacion : ''}
                        onChange={(e) => setEditedTag({ ...editedTag, Puntuacion: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 1, max: 5 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditTagDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveEditTag} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmChangesDialogOpen} onClose={() => setConfirmChangesDialogOpen(false)}>
                <DialogTitle>Confirmar Cambios</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que quieres guardar los cambios?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmChangesDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmChangesTags} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Oferta;
