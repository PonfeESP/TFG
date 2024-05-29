import React, { useState, useEffect } from 'react';
import {
    Slider, Container, Autocomplete, Alert, TextField, Typography, IconButton, Box, Grid, Button, Chip, Paper, Drawer, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit as EditIcon, Description as DescriptionIcon, Save as SaveIcon, Upload as UploadIcon, Visibility as VisibilityIcon, Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { axiosConfig } from '../../../constant/axiosConfig.constant';


export const Perfil = ({ userId, userType }) => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState({});
    const [errors, setErrors] = useState({}); // Cambiado de error a errors
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);
    const [isTagsDrawerOpen, setIsTagsDrawerOpen] = useState(false);
    const [tagsList, setTagsList] = useState([]);
    const [newTag, setNewTag] = useState({ Lenguaje: '', Puntuacion: 1 });
    const [editTagDialogOpen, setEditTagDialogOpen] = useState(false);
    const [editedTag, setEditedTag] = useState(null);
    const [confirmChangesDialogOpen, setConfirmChangesDialogOpen] = useState(false);
    const [isAddingTagFormOpen, setIsAddingTagFormOpen] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setErrors('Error al cargar los datos del usuario');
            });
    }, [userId]);

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

        if (!userData.Nombre.trim()) {
            newErrors.Nombre = 'El nombre no puede estar vacío.';
            hasErrors = true;
        }

        if (!userData.Email.trim()) {
            newErrors.Email = 'El email no puede estar vacío.';
            hasErrors = true;
        }

        if (!userData.Descripcion.trim()) {
            newErrors.Descripcion = 'La descripción no puede estar vacía.';
            hasErrors = true;
        }

        if (!userData.Edad.toString().trim()) {
            newErrors.Edad = 'La edad no puede estar vacía.';
            hasErrors = true;
        }

        if (!userData.Experiencia_Laboral.toString().trim()) {
            newErrors.Experiencia_Laboral = 'La experiencia laboral no puede estar vacía.';
            hasErrors = true;
        }

        if (!userData.Estudios.trim()) {
            newErrors.Estudios = 'Los estudios no pueden estar vacíos.';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios({
                ...axiosConfig,
                url: `http://localhost:8000/usuarios/${userId}`,
                method: 'PUT',
                data: userData
            });
            setUserData(res.data);
            handleEditClick(field);
        } catch (err) {
            console.error("Error updating data:", err);
            setErrors('Error al actualizar los datos del usuario');
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setUserData(prevUserData => ({
            ...prevUserData,
            [field]: value
        }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Por favor, seleccione un archivo PDF.');
        }
    };

    const handleUploadClick = () => {
        if (!selectedFile) {
            alert('Por favor, seleccione un archivo PDF.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', selectedFile);

        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios/${userId}/pdf`,
            method: 'PUT',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(res => {
                setUserData(res.data);
                setSelectedFile(null);
                setIsPdfDrawerOpen(false);
                setIsTagsDrawerOpen(false);
            })
            .catch(err => {
                console.error("Error uploading PDF:", err);
                setErrors('Error al subir el archivo PDF');
            });
    };

    const togglePdfDrawer = () => {
        setIsPdfDrawerOpen(!isPdfDrawerOpen);
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
        setUserData((prev) => ({
            ...prev,
            Tags: prev.Tags.map(tag => tag.Lenguaje === editedTag.Lenguaje ? editedTag : tag)
        }));
        setEditTagDialogOpen(false);
    };

    const handleDeleteTag = (tag) => {
        setUserData((prev) => ({
            ...prev,
            Tags: prev.Tags.filter(t => t.Lenguaje !== tag.Lenguaje)
        }));
    };

    const handleTagChange = (e, value) => {
        if (!value) return;
        const tagExists = userData.Tags.some(tag => tag.Lenguaje === value.Lenguaje);
        if (tagExists) {
            setErrors('Este tag ya está registrado para el usuario');
        } else {
            setNewTag(value);
        }
    };

    const openPdfInNewWindow = () => {
        window.open(`http://localhost:8000/pdfs/${userData.CurriculumPDF}`, '_blank');
    };

    const handleAddNewTag = () => {
        if (!newTag.Lenguaje || newTag.Puntuacion < 1 || newTag.Puntuacion > 5) {
            console.log("FUFUF", newTag.Lenguaje, newTag.Puntuacion)
            setErrors('Por favor, complete todos los campos adecuadamente');
            setOpenErrorDialog(true);
            return;
        }
        const tagExists = userData.Tags.some(tag => tag.Lenguaje === newTag.Lenguaje);
        if (tagExists) {
            setErrors('Este tag ya está registrado para el usuario');
            return;
        }
        setUserData(prevUserData => ({
            ...prevUserData,
            Tags: [
                ...prevUserData.Tags,
                newTag
            ]
        }));

        setIsAddingTagFormOpen(false);

        setNewTag({ Lenguaje: '', Puntuacion: '' });
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    };

    const handleConfirmChanges = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios/${userId}`,
            method: 'PUT',
            data: userData
        })
            .then(res => {
                console.log("Cambios guardados en el perfil del usuario:", res.data);
                setConfirmChangesDialogOpen(false);
            })
            .catch(err => {
                console.error("Error al guardar cambios en el perfil del usuario:", err);
            });
    };

    const handleConfirmChangesTags = () => {

        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios/${userId}`,
            method: 'PUT',
            data: { Tags: userData.Tags }
        })
            .then(res => {
                console.log("Cambios guardados en los tags del usuario:", res.data);
                setConfirmChangesDialogOpen(false);
            })
            .catch(err => {
                console.error("Error al guardar cambios en los tags del usuario:", err);
            });
    };


    if (!userData) return <div>Loading...</div>;

    if (userType === 'Desempleado') {
        return (
            <Container>
                <Typography variant="h4" gutterBottom textAlign={"center"} marginTop={'25px'} marginBottom={'20px'}>
                    Tu Perfil
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        {[
                            { label: 'Nombre', name: 'Nombre', type: 'text' },
                            { label: 'Email', name: 'Email', type: 'email' },
                            { label: 'Descripción', name: 'Descripcion', type: 'text' },
                            { label: 'Edad', name: 'Edad', type: 'number' },
                            { label: 'Experiencia Laboral', name: 'Experiencia_Laboral', type: 'number' },
                            { label: 'Estudios', name: 'Estudios', type: 'text' }
                        ].map((field, index) => (
                            <Box key={index} display="flex" alignItems="center" mb={2}>
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={userData[field.name]}
                                    onChange={(e) => handleChange(e, field.name)}
                                    disabled={!isEditing[field.name]}
                                    variant="outlined"
                                    margin="normal"
                                    error={!!errors[field.name]}
                                    helperText={errors[field.name]}
                                />
                                <IconButton onClick={() => isEditing[field.name] ? handleSaveClick(field.name) : handleEditClick(field.name)}>
                                    {isEditing[field.name] ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box mb={2} textAlign="center">
                            <Typography variant="h5" gutterBottom>
                                Tus Tags
                            </Typography>
                            <IconButton size="large" onClick={toggleTagsDrawer}>
                                <EditIcon fontSize="large" />
                            </IconButton>
                        </Box>
                        <Drawer anchor="right" open={isTagsDrawerOpen} onClose={toggleTagsDrawer}>
                            <Box p={2} width={400}>
                                <Typography variant="h6" gutterBottom>
                                    Lista de tus Tags
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
                                    {userData.Tags.map((tag, index) => (
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

                                <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                                    <DialogTitle>Error</DialogTitle>
                                    <DialogContent>
                                        <Alert severity="error">{'Asegurese de completar los campos y de no repetir los tags'}</Alert>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
                                            OK
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Dialog>
                        <Box mt={4} textAlign="center" marginTop={'60px'}>
                            {window.innerWidth > 600 ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Tu Curriculum PDF
                                    </Typography>
                                    <IconButton onClick={togglePdfDrawer}>
                                        <DescriptionIcon fontSize="large" />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Tu Curriculum PDF
                                    </Typography>
                                    <IconButton onClick={openPdfInNewWindow}>
                                        <DescriptionIcon fontSize="large" />
                                    </IconButton>
                                    <Box p={2} textAlign={'center'}>
                                        <Typography variant="h6" gutterBottom>
                                            Subir nuevo Curriculum
                                        </Typography>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />
                                        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<UploadIcon />}
                                                onClick={handleUploadClick}
                                                disabled={!selectedFile}
                                                style={{ marginTop: '10px' }}
                                            >
                                                Subir PDF
                                            </Button>
                                        </div>
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Drawer anchor="right" open={isPdfDrawerOpen} onClose={togglePdfDrawer}>
                            <Box p={2} textAlign={'center'}>
                                <Typography variant="h6" gutterBottom>
                                    {userData.CurriculumPDF ? 'Vista previa y reemplazo del PDF' : 'Subir PDF'}
                                </Typography>
                                {userData.CurriculumPDF && (
                                    <div style={{ marginTop: '40px', marginBottom: '20px', minWidth: '500px' }}>
                                        <iframe
                                            src={`http://localhost:8000/pdfs/${userData.CurriculumPDF}`}
                                            width="100%"
                                            height="500px"
                                            title="Curriculum PDF"
                                            onClick={() => window.open(`http://localhost:8000/pdfs/${userData.CurriculumPDF}`, '_blank')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<UploadIcon />}
                                        onClick={handleUploadClick}
                                        disabled={!selectedFile}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Subir PDF
                                    </Button>
                                </div>
                            </Box>
                        </Drawer>
                    </Grid>
                </Grid>
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
    } else if (userType === 'Empresa') {
        return (
            <Container>
                <Typography variant="h4" gutterBottom>
                    Tu Perfil
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="Nombre"
                                type="text"
                                value={userData.Nombre}
                                onChange={(e) => handleChange(e, 'Nombre')}
                                disabled={!isEditing.Nombre}
                                variant="outlined"
                                margin="normal"
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
                                label="Email"
                                name="Email"
                                type="email"
                                value={userData.Email}
                                onChange={(e) => handleChange(e, 'Email')}
                                disabled={!isEditing.Email}
                                variant="outlined"
                                margin="normal"
                                error={!!errors.Email}
                                helperText={errors.Email}
                            />
                            <IconButton onClick={() => isEditing.Email ? handleSaveClick('Email') : handleEditClick('Email')}>
                                {isEditing.Email ? <SaveIcon /> : <EditIcon />}
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
                                value={userData.Descripcion}
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
    }
};

export default Perfil;


