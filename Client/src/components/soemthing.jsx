import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState('Desempleado');
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
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [registroErrorMessage, setRegistroErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        edad: "",
        experiencia_Laboral: "",
        estudios: "",
        tags: [],
        tagsExperience: {},
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        nombreError: false,
        descripcionError: false,
        edadError: false,
        experienciaError: false,
        estudiosError: false,
        tagsError: false,
        userError: false,
        emailError: false,
        passwordError: false,
        confirmPasswordError: false,
        registroError: ""
    });



    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setProgrammingLanguages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleNextStep = () => {
        setRegistroErrorMessage("");
        switch (currentStep) {
            case 1:
                if (nombre === '' || descripcion === '' || edad === '' || experiencia_Laboral === '' || estudios === '') {
                    setNombreError(nombre === '');
                    setDescripcionError(descripcion === '');
                    setEdadError(edad === '');
                    setExperienciaError(experiencia_Laboral === '');
                    setEstudiosError(estudios === '');
                    return;
                }
                break;
            case 2:
                if (tags.length === 0) {
                    setTagsError(tags.length === 0);
                    return;
                }
                break;
            default:
                break;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Function for registering Empresa
    const registerEmpresa = () => {
        setUserError(false);
        setEmailError(false);
        setPasswordError(false);
        setRegistroError('');
        setNombreError(false);
        setDescripcionError(false);

        if (email === '') setUserError(true);
        if (password === '') setPasswordError(true);
        if (descripcion === '') setDescripcionError(true);
        if (nombre === '') setNombreError(true);

        if (!!nombre && !!email && !!password && !!descripcion) {
            const userData = {
                Nombre: nombre,
                Email: email,
                Contraseña: password,
                Rol: 'Empresa',
                Descripcion: descripcion
            };

            axios({
                url: 'http://localhost:8000/registro/usuario/empresa',
                method: 'POST',
                withCredentials: true,
                data: userData,
            })
                .then((response) => {
                    console.log('Registro exitoso:', response.data);
                    if (response.data.status === 'OK') {
                        setRegistroError('El usuario se ha registrado exitosamente.');
                    } else {
                        setRegistroError('Error en el registro');
                    }
                })
                .catch((error) => {
                    console.error('Error en el registro:', error);
                    if (error.response && error.response.status === 400 && error.response.data.error === 'Este Email ya está registrado') {
                        setEmailError(true);
                        setRegistroError('El correo electrónico ya está registrado.');
                    } else {
                        setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
                    }
                });
        }
    };

    const registerDesempleado = () => {
        switch (currentStep) {
            case 1:
                if (nombre === '' || descripcion === '') {
                    setNombreError(nombre === '');
                    setDescripcionError(descripcion === '');
                    return;
                }
                break;
            case 2:
                if (edad === '' || experiencia_Laboral === '' || estudios === '' || tags.length === 0) {
                    setEdadError(edad === '');
                    setExperienciaError(experiencia_Laboral === '');
                    setEstudiosError(estudios === '');
                    setTagsError(tags.length === 0);
                    return;
                }
                break;
            case 3:
                if (email === '' || password === '' || confirmPassword === '') {
                    setUserError(email === '');
                    setPasswordError(password === '');
                    setConfirmPasswordError(confirmPassword === '' || confirmPassword !== password);
                    console.log("WHY", confirmPasswordError)
                    return;
                }
                break;
            default:
                break;
        }

        if (!!nombre && !!email && !!password && !!confirmPassword && !!descripcion && !!edad && !!experiencia_Laboral && !!estudios && !!tags.length) {
            if (password !== confirmPassword) {
                setConfirmPasswordError(true);
            } else {
                const tagsWithExperience = tags.map(tag => ({
                    Lenguaje: tag.label,
                    Puntuacion: tagsExperience[tag.value] || 0
                }));

                const userData = {
                    Nombre: nombre,
                    Email: email,
                    Contraseña: password,
                    Rol: 'Desempleado',
                    Descripcion: descripcion,
                    Edad: parseInt(edad),
                    Experiencia_Laboral: parseInt(experiencia_Laboral),
                    Estudios: estudios,
                    Tags: tagsWithExperience,
                };

                axios({
                    url: 'http://localhost:8000/registro/usuario/desempleado',
                    method: 'POST',
                    withCredentials: true,
                    data: userData,
                })
                    .then((response) => {
                        console.log('Registro exitoso:', response.data);
                        if (response.data.status === 'OK') {
                            setRegistroError('El usuario se ha registrado exitosamente.');
                            handleSuccessfulRegistrationCleanup(true);
                        } else {
                            setRegistroError('Error en el registro');
                            setSeverity('error');
                            setSnackbarMessage('Error en el registro')
                            setSnackbarOpen(true);
                        }
                    })
                    .catch((error) => {
                        console.error('Error en el registro:', error);
                        if (error.response && error.response.status === 400 && error.response.data.error === 'Este Email ya está registrado') {
                            setEmailError(true);
                            setRegistroError('El correo electrónico ya está registrado.');
                            handleSuccessfulRegistrationCleanup(false);
                        } else {
                            setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
                            handleSuccessfulRegistrationCleanup(false);
                        }
                    });
            }
        }

    };

    const handleSuccessfulRegistrationCleanup = (registroExitoso) => {

        if (registroExitoso) {
            setRegistroExitoso(true);
            setRegistroErrorMessage("");


            console.log("please2", registroExitoso)


            setTimeout(() => {
                handleClose();
            }, 3000);

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRol('Desempleado');
            setNombre("");
            setDescripcion("");
            setEdad("");
            setExperienciaLaboral("");
            setEstudios("");
            setTags([]);
            setTagsExperience({});
            setCurrentStep(1);

        } else {
            setRegistroExitoso(false);
            setRegistroErrorMessage("Error en el registro. Inténtalo de nuevo, por favor.");
        }

    };

    const performRegister = () => {
        if (rol === 'Empresa') {
            registerEmpresa();
        } else if (rol === 'Desempleado') {
            registerDesempleado();
        }
    };

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>

            <div>
                <Button onClick={handleClickOpen}>Registrarse</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText textAlign={'center'}>
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

                        {rol === 'Empresa' && (
                            <div>
                                <TextField
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    margin="dense"
                                    id="nombre"
                                    label="Nombre"
                                    fullWidth
                                    variant="standard"
                                    error={nombreError}
                                    helperText={nombreError && 'Por favor, ingrese un nombre.'}
                                />
                                <TextField
                                    required
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    margin="dense"
                                    id="descripcion"
                                    label="Descripcion de la Empresa"
                                    fullWidth
                                    variant="standard"
                                    error={descripcionError}
                                    helperText={descripcionError && 'Por favor, ingrese una descripción.'}
                                />
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
                                    helperText={confirmPasswordError && 'Las contraseñas no coinciden'}
                                />
                                <DialogActions>
                                    <Button onClick={handleClose}
                                        variant="contained"
                                        sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}>
                                        CANCELAR
                                    </Button>
                                    <Button
                                        onClick={performRegister}
                                        variant="contained"
                                        sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}>
                                        REGISTRARSE
                                    </Button>
                                </DialogActions>
                            </div>
                        )}
                        {rol === 'Desempleado' && (
                            <div>
                                {currentStep === 1 && (
                                    <div>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>

                                            <Button
                                                onClick={handleNextStep}
                                                variant="contained"
                                                sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '30%' }}>
                                                Siguiente
                                            </Button>
                                        </Box>
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div>
                                        <Autocomplete
                                            multiple
                                            options={programmingLanguages.map(language => ({ label: language.Nombre, value: language._id }))}
                                            getOptionLabel={option => option.label}
                                            value={tags}
                                            onChange={handleTagsChange}
                                            renderInput={params => (
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
                                        {tags.map(tag => (
                                            <Box key={tag.value}>
                                                <span>{tag.label}</span>
                                                <Rating
                                                    name={tag.value}
                                                    value={tagsExperience[tag.value] || 0}
                                                    onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                                                />
                                            </Box>
                                        ))}
                                        <Button
                                            onClick={handlePreviousStep}
                                            variant="contained"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginLeft: '5%', marginRight: '10%' }}>
                                            Anterior
                                        </Button>
                                        <Button onClick={handleNextStep}
                                            variant="contained"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginRight: '5%' }}>
                                            Siguiente
                                        </Button>
                                    </div>
                                )}
                                {currentStep === 3 && (
                                    <div>
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
                                            helperText={confirmPasswordError && 'Las contraseñas no coinciden'}
                                        />
                                        <Button
                                            onClick={handlePreviousStep}
                                            variant="contained"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginLeft: '5%', marginRight: '10%' }}>
                                            Anterior
                                        </Button>
                                        <Button onClick={performRegister}
                                            variant="contained"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginRight: '5%' }}>
                                            Registrarse
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                    </DialogContent>
                </Dialog>
            </div>
        </ThemeProvider>

    );
};