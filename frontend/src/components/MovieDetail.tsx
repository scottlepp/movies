import { Container, Box, Typography, CardMedia, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import config from '../config/config';
import { fetch } from '../api/api';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  genre: string;
  director: string;
  poster_url: string;
}

const DEFAULT_IMAGE_URL = 'https://placehold.co/400x400';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [imageError, setImageError] = useState<string>(); // Track image errors
  const navigate = useNavigate();
  
  useEffect(() => {
    // @ts-ignore
    const apiBaseUrl = config.apiBaseUrl;
    fetch(`${apiBaseUrl}/movies/${id}`)
      .then(data => setMovie(data));
  }, [id]);

  if (!movie) return (<Typography>Loading...</Typography>);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Function to check if the URL is valid (checks if it's a valid URL and a reachable URL)
  const isValidUrl = async (url: string) => {
    try {
        new URL(url);
    } catch {
        return false;
    }
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch {
      return false;
    }
  };
  
  // Function to handle image validation
  const handleImageError = async (url: string) => {
    if (url && !(await isValidUrl(url))) {
      setImageError(url);
    }
  };

  return (
    <Container disableGutters sx={{ mt: 1, p:0}}>
      <Box sx={{ mb: 0, p:0 }}>
        <Button
          variant="outlined"
          onClick={handleBackClick}
          sx={{
            mb: 2,
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          Back To Movies
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={0}>
        <Typography variant="h4" gutterBottom>
          {movie.title}
        </Typography>
        <CardMedia
          component="img"
          image={imageError !== "" ? DEFAULT_IMAGE_URL : movie.poster_url} // Use default if image has failed
          onError={() => handleImageError(movie.poster_url)}
          alt={movie.title}
          style={{ width: '300px' }}
        />
        <Typography variant="h6" mt={2}>
          Genre: {movie.genre}
        </Typography>
        <Typography variant="h6">Director: {movie.director}</Typography>
        <Typography variant="h6">Release Date: {movie.release_date}</Typography>
        <Typography mt={2}>{movie.description}</Typography>
      </Box>
    </Container>
  );
};

export default MovieDetail;