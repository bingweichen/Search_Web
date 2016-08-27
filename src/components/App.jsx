import React, { Component, PropTypes } from 'react';
import Todos from './Todos/Todos';
import MainLayout from '../layouts/MainLayout/MainLayout';

const App = ({ children }) => {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

App.propTypes = {
};

export default App;
