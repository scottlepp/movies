import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import { fetch } from '../api/api';

const NewMovieForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('');
  const [director, setDirector] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const movie = { title, description, release_date: releaseDate, genre, director, poster_url: posterUrl };
    const apiBaseUrl = config.apiBaseUrl;
    const data = await fetch(`${apiBaseUrl}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    console.log('Movie added:', data);
    navigate('/'); // Navigate to the home page after success
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
        <TextField label="Title" value={title} onChange={(e: any) => setTitle(e.target.value)} fullWidth />
        <TextField
          label="Description"
          value={description}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        <TextField label="Release Date" type="date" value={releaseDate} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReleaseDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField label="Genre" value={genre} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setGenre(e.target.value)} fullWidth />
        <TextField label="Director" value={director} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDirector(e.target.value)} fullWidth />
        <TextField label="Poster URL" value={posterUrl} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPosterUrl(e.target.value)} fullWidth />
        <Button type="submit" variant="contained" color="primary" size="large">
          Add Movie
        </Button>
      </Box>
    </Container>
  );
};

export default NewMovieForm;