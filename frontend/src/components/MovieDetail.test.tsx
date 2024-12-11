import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MovieDetail from './MovieDetail';
import '@testing-library/jest-dom';

jest.mock('../api/api', () => ({
  fetch: jest.fn(() => Promise.resolve(
    { 
      id: 1,
      title: 'Inception',
      description: 'A mind-bending thriller by Christopher Nolan.',
      genre: 'Sci-Fi',
      release_date: '2010-07-16',
      director: 'Christopher Nolan',
      poster_url: 'http://example.com/inception.jpg',
    },
  )),
}));

test('renders movie detail', async () => {
  render(
    <MemoryRouter initialEntries={['/movies/1']}>
      <Routes>
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for the movie details to load
  await waitFor(() => expect(screen.getByText(/Inception/i)).toBeInTheDocument());

  // Verify movie details
  expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
  screen.getAllByText(/Christopher Nolan/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });
  expect(screen.getByText(/2010-07-16/i)).toBeInTheDocument();
});
