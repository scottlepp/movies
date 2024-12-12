import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewMovieForm from './NewMovieForm';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { fetch } from '../api/api';

jest.mock('../api/api', () => ({
  fetch: jest.fn(() => Promise.resolve(
    { message: 'Movie added successfully' }
  )),
}));

describe('NewMovieForm', () => {
    beforeEach(() => {
    render(<MemoryRouter>
              <NewMovieForm />
          </MemoryRouter>);
    });
  
    it('renders the form with input fields', () => {
      expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Release Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Genre/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Director/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Poster URL/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Movie/ })).toBeInTheDocument();
    });
  
    it('allows the user to type in the input fields', () => {
      fireEvent.change(screen.getByLabelText(/Title/) as HTMLInputElement, { target: { value: 'Inception' } });
      fireEvent.change(screen.getByLabelText(/Description/) as HTMLTextAreaElement, { target: { value: 'A mind-bending thriller' } });
      fireEvent.change(screen.getByLabelText(/Release Date/) as HTMLInputElement, { target: { value: '2010-07-16' } });
      fireEvent.change(screen.getByLabelText(/Genre/) as HTMLInputElement, { target: { value: 'Sci-Fi' } });
      fireEvent.change(screen.getByLabelText(/Director/) as HTMLInputElement, { target: { value: 'Christopher Nolan' } });
      fireEvent.change(screen.getByLabelText(/Poster URL/) as HTMLInputElement, { target: { value: 'https://example.com/inception.jpg' } });
  
      expect((screen.getByLabelText(/Title/) as HTMLInputElement).value).toBe('Inception');
      expect((screen.getByLabelText(/Description/) as HTMLTextAreaElement).value).toBe('A mind-bending thriller');
      expect((screen.getByLabelText(/Release Date/) as HTMLInputElement).value).toBe('2010-07-16');
      expect((screen.getByLabelText(/Genre/) as HTMLInputElement).value).toBe('Sci-Fi');
      expect((screen.getByLabelText(/Director/) as HTMLInputElement).value).toBe('Christopher Nolan');
      expect((screen.getByLabelText(/Poster URL/) as HTMLInputElement).value).toBe('https://example.com/inception.jpg');
    });
  
    it('submits the form and calls fetch', async () => {
      fireEvent.change(screen.getByLabelText(/Title/) as HTMLInputElement, { target: { value: 'Inception' } });
      fireEvent.change(screen.getByLabelText(/Description/) as HTMLTextAreaElement, { target: { value: 'A mind-bending thriller' } });
      fireEvent.change(screen.getByLabelText(/Release Date/) as HTMLInputElement, { target: { value: '2010-07-16' } });
      fireEvent.change(screen.getByLabelText(/Genre/) as HTMLInputElement, { target: { value: 'Sci-Fi' } });
      fireEvent.change(screen.getByLabelText(/Director/) as HTMLInputElement, { target: { value: 'Christopher Nolan' } });
      fireEvent.change(screen.getByLabelText(/Poster URL/) as HTMLInputElement, { target: { value: 'https://example.com/inception.jpg' } });
  
      fireEvent.click(screen.getByRole('button', { name: /Add Movie/ }));
  
      // Wait for the fetch to be called and then check if it was called with the correct data
      await waitFor(() => expect(fetch).toHaveBeenCalledWith(
        'movies',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Inception',
            description: 'A mind-bending thriller',
            release_date: '2010-07-16',
            genre: 'Sci-Fi',
            director: 'Christopher Nolan',
            poster_url: 'https://example.com/inception.jpg',
          }),
        })
      ));
  
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });