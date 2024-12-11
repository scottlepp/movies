import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Gallery
        </Typography>
        <Button color="inherit" component={Link} to="/">Movies</Button>
        <Button color="inherit" component={Link} to="/new">Add Movie</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;