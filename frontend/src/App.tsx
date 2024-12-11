import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from './components/MovieDetail';
import NewMovieForm from './components/NewMovieForm';
import MovieList from './components/MovieList';
import NavBar from './components/NavBar';


const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/new" element={<NewMovieForm />} />
      </Routes>
    </Router>
  );
};

export default App;