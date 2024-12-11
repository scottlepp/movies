import { Container, Typography, Card, CardMedia, CardContent, Grid2, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config';
import { fetch } from '../api/api';

type Movie = {
  ID: number;
  title: string;
  release_date: string;
  genre: string;
  poster_url: string;
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set()); // Track image errors

  // Define a placeholder image URL (you can replace this with any URL to a default image)
  const DEFAULT_IMAGE_URL = 'https://placehold.co/200x400'; // A simple placeholder image

  useEffect(() => {
    const apiBaseUrl = config.apiBaseUrl;
    fetch(`${apiBaseUrl}/movies`)
      .then(data => setMovies(data));
  }, []);
    
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

  // Function to handle image validation and update errors if necessary
  const handleImageError = async (url: string) => {
    if (url && !(await isValidUrl(url))) {
      setImageErrors((prev) => new Set(prev).add(url)); // Add the failed URL to the set of errors
    }
  };

  return (
    <Container>
        <Typography variant="h5" align="center" gutterBottom>
        </Typography>
        <Grid2 container spacing={3}>
        {movies.map(movie => (
            <Grid2 key={movie.ID}>
                <Card>
                    <CardMedia
                        component="img"
                        alt={movie.title}
                        height="300"
                        image={imageErrors.has(movie.poster_url) || movie.poster_url == "" ? DEFAULT_IMAGE_URL : movie.poster_url} // Use default if image has failed
                        onError={() => handleImageError(movie.poster_url)}
                    />
                    <CardContent>
                    <Typography variant="h6">{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Genre: {movie.genre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Release Date: {movie.release_date}
                    </Typography>
                    <Button
                        component={Link}
                        to={`/movies/${movie.ID}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        >
                        View Details
                    </Button>
                    </CardContent>
                </Card>
            </Grid2>
        ))}
        </Grid2>
    </Container>
  );
};

export default MovieList;