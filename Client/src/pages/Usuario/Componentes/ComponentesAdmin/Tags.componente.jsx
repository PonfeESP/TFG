import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Container, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Alert, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const TagsPage = () => {
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const [errors, setErrors] = useState(null);
    const [newTagName, setNewTagName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = () => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setTags(res.data);
                setErrors(null);
            })
            .catch(err => {
                console.error("Error fetching tags:", err);
                setErrors('Error al cargar los tags');
            });
    };

    const handleDelete = async (Nombre) => {
        try {
            await axios({
                ...axiosConfig,
                url: `http://localhost:8000/tags/${Nombre}`,
                method: 'DELETE'
            });
            fetchTags();
            setErrors(null);
        } catch (error) {
            console.error('Error deleting tag', error);
            setErrors('Error al eliminar el tag');
        }
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) {
            setErrors('Nombre del tag no puede estar vacío');
            return;
        }

        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'POST',
            data: { Nombre: newTagName }
        })
            .then(res => {
                setNewTagName('');
                setModalOpen(false);
                fetchTags();
                setErrors(null);
            })
            .catch(err => {
                console.error('Error adding tag:', err);
                setErrors('Error al añadir el tag');
            });
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredTags = tags.filter((tag) =>
        tag.Nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Tags
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                    label="Buscar por nombre"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setModalOpen(true)}
                >
                    Añadir Nuevo
                </Button>
            </div>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogContent>
                    <TextField
                        label="Nombre del Tag"
                        variant="outlined"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        fullWidth
                    />
                    {errors && <Typography color="error">{errors}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddTag} variant="contained" color="primary">Añadir</Button>
                </DialogActions>
            </Dialog>
            {errors && <Alert severity="error">{errors}</Alert>}
            <List>
                {filteredTags.map((tag) => (
                    <ListItem key={tag._id}>
                        <ListItemText primary={tag.Nombre} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(tag.Nombre)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default TagsPage;
