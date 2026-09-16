import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ToDoApp } from './components/ToDoApp';
import { AuthForm } from './components/AuthForm';
import { useAppDispatch, useAppSelector } from './store/store';
import { fetchProfile } from './store/authSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Restore user profile session if token exists in localStorage
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container pb-5">
        {token ? <ToDoApp /> : <AuthForm />}
      </div>
    </div>
  );
};

export default App;