import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import { Provider } from 'react-redux';
import store from './redux/store';
import Resume from './pages/resume';
import ImportPage from './pages/importPage';
import Error404 from './pages/error404';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/resume/new"
            element={<Resume />}
          />
          <Route
            path="/resume/import"
            element={<ImportPage />}
          />

          <Route
            path="*"
            element={<Error404 />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
