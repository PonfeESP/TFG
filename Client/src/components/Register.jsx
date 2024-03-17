import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';


export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState('');
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [edad, setEdad] = useState("");
    const [experiencia_Laboral, setExperienciaLaboral] = useState("");
    const [estudios, setEstudios] = useState("");
    const [tags, setTags] = useState([]);
    const [tagsExperience, setTagsExperience] = useState({});
    const [userError, setUserError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [rolError, setRolError] = useState(false);
    const [nombreError, setNombreError] = useState(false);
    const [descripcionError, setDescripcionError] = useState(false);
    const [edadError, setEdadError] = useState(false);
    const [experienciaError, setExperienciaError] = useState(false);
    const [estudiosError, setEstudiosError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [registroError, setRegistroError] = useState("");
    const [open, setOpen] = useState(false);

    const programmingLanguages = [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        // Add more programming languages as needed
    ];

    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    const handleExperienceChange = (event, value, tag) => {
        setTagsExperience({ ...tagsExperience, [tag]: value });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const performRegister = (event) => {
        event.preventDefault();

        setUserError(false);
        setEmailError(false);
        setPasswordError(false);
        setRegistroError('');
        setNombreError(false);
        setDescripcionError(false);
        setEdadError(false);
        setExperienciaError(false);
        setEstudiosError(false);
        setTagsError(false);

        if (email === '') setUserError(true);
        if (password === '') setPasswordError(true);
        if (confirmPassword === '') setConfirmPasswordError(true);
        if (rol === '') setRolError(true);
        if (nombre === '') setNombreError(true);
        if (descripcion === '') setDescripcionError(true);
        if (edad === '') setEdadError(true);
        if (experiencia_Laboral === '') setExperienciaError(true);
        if (estudios === '') setEstudiosError(true);
        if (tags.length === 0) setTagsError(true);

        if (!!nombre && !!email && !!password && !!confirmPassword && !!rol && tags.length > 0) {

            if (password !== confirmPassword) {
                setRegistroError('Las contraseñas son distintas. Pruébelo de nuevo.');
            } else {
                const tagsWithExperience = tags.map(tag => ({
                    tag: tag.value,
                    experience: tagsExperience[tag.value] || 0
                }));

                axios({
                    url: 'http://localhost:8000/Registro/Usuario',
                    method: 'POST',
                    withCredentials: true,
                    data: {
                        Nombre: nombre,
                        Email: email,
                        Contraseña: password,
                        Rol: rol,
                        Descripcion: descripcion,
                        Edad: parseInt(edad),
                        Experiencia_Laboral: parseInt(experiencia_Laboral),
                        Estudios: estudios,
                        Tags: tagsWithExperience.map(tag => ({ Lenguaje: tag.tag, Puntuacion: tag.experience }))
                    },
                })
                .then((response) => {
                    console.log('Request data:', response.data);
                    if (response.data.status === 'OK') {
                        setRegistroError('El usuario se ha registrado como Cliente.');
                    } else {
                        setRegistroError('Error en el registro');
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                    setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
                });
            }
        }
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Registrarse</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registrarse</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Por favor, complete el formulario de registro.
                    </DialogContentText>

                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <InputLabel htmlFor="user-type">Usuario</InputLabel>
                            <Select
                                autoFocus
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                label="rol"
                                inputProps={{
                                    name: 'user-type',
                                    id: 'user-type',
                                }}
                            >
                                <MenuItem value="Empresa">Empresa</MenuItem>
                                <MenuItem value="Desempleado">Desempleado</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        required
                        onChange={(e) => setNombre(e.target.value)}
                        margin="dense"
                        id="nombre"
                        label="Nombre"
                        fullWidth
                        variant="standard"
                        error={nombreError}
                        helperText={nombreError && 'Por favor, ingrese un nombre.'}
                    />

                    {rol === 'Empresa' && (
                        <TextField
                            required
                            onChange={(e) => setDescripcion(e.target.value)}
                            margin="dense"
                            id="descripcion"
                            label="Descripcion de la Empresa"
                            fullWidth
                            variant="standard"
                            error={descripcionError}
                            helperText={descripcionError && 'Por favor, ingrese una descripción.'}
                        />
                    )}

                    {rol === 'Desempleado' && (
                        <div>
                            <TextField
                                required
                                onChange={(e) => setDescripcion(e.target.value)}
                                margin="dense"
                                id="descripcion"
                                label="Descripcion"
                                fullWidth
                                variant="standard"

                            />
                            <TextField
                                required
                                onChange={(e) => setEdad(e.target.value)}
                                margin="dense"
                                id="edad"
                                label="Edad"
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: 2 }}
                                error={edadError}
                                helperText={edadError && 'Indique su edad, por favor.'}

                            />
                            <TextField
                                required
                                onChange={(e) => setExperienciaLaboral(e.target.value)}
                                margin="dense"
                                id="experienciaLaboral"
                                label="Años trabajados"
                                fullWidth
                                variant="standard"
                                error={experienciaError}
                                helperText={experienciaError && 'Indique su Experiencia Laboral, por favor.'}
                            />
                            <TextField
                                required
                                onChange={(e) => setEstudios(e.target.value)}
                                margin="dense"
                                id="estudios"
                                label="Estudios"
                                fullWidth
                                variant="standard"
                                error={estudiosError}
                                helperText={estudiosError && 'Indique sus Estudios, por favor.'}
                            />
                            <Autocomplete
                                multiple
                                options={programmingLanguages}
                                getOptionLabel={(option) => option.label}
                                value={tags}
                                onChange={handleTagsChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Tags (Programming Languages)"
                                        placeholder="Select tags"
                                        error={tagsError}
                                        helperText={tagsError && 'Por favor, seleccione al menos un tag.'}
                                    />
                                )}
                            />
                            {tags.map((tag) => (
                                <Box key={tag.value}>
                                    <span>{tag.label}</span>
                                    <Rating
                                        name={tag.value}
                                        value={tagsExperience[tag.value] || 0}
                                        onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                                    />
                                </Box>
                            ))}
                        </div>
                    )}

                    <TextField
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        margin="dense"
                        id="email"
                        label="Correo"
                        fullWidth
                        variant="standard"
                        error={userError}
                        helperText={userError && 'Por favor, ingrese un correo válido.'}
                    />
                    <TextField
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        margin="dense"
                        id="password"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        variant="standard"
                        error={passwordError}
                        helperText={passwordError && 'Por favor, ingrese una contraseña.'}
                    />
                    <TextField
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="dense"
                        id="confirm-password"
                        label="Confirmar Contraseña"
                        type="password"
                        fullWidth
                        variant="standard"
                        error={confirmPasswordError}
                        helperText={confirmPasswordError && 'Por favor, confirme su contraseña.'}
                    />
                    {registroError && <h4>{registroError}</h4>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CANCELAR</Button>
                    <Button onClick={performRegister}>REGISTRARSE</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
