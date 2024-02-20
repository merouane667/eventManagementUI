import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home';
import CreateEvent from './pages/createEvent/CreateEvent';
import ManageYourEvents from './pages/manageYourEvents/ManageYourEvents';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="create-event" element={<CreateEvent /> } />
            <Route path="manage-events" element={<ManageYourEvents /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;