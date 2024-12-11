import { render, screen, waitFor } from '@testing-library/react';
import MovieList from './MovieList';
import '@testing-library/jest-dom';

jest.mock('../api/api', () => ({
  fetch: jest.fn(() => Promise.resolve(
    { 
      id: 1, title: 'Inception', 
      genre: 'Sci-Fi', 
      release_date: '2010-07-16', 
      poster_url: 'http://example.com/inception.jpg' 
    },
  )),
}));

test('renders movie list', async () => {
  render(<MovieList />);

  // Check heading
  expect(screen.getByText(/Movie Gallery/i)).toBeInTheDocument();

  // Wait for the movies to load
  await waitFor(() => expect(screen.getByText(/Inception/i)).toBeInTheDocument());

  // Verify movie details
  expect(screen.getByText(/Genre: Sci-Fi/i)).toBeInTheDocument();
  expect(screen.getByText(/Release Date: 2010-07-16/i)).toBeInTheDocument();
});
