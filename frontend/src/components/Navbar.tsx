import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProfile, logout } from '../store/authSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">Machen ToDo</a>
        <div className="d-flex align-items-center">
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-secondary text-uppercase">{user.role}</span>
              <span className="text-light fw-semibold">{user.username}</span>
              <button 
                className="btn btn-outline-danger btn-sm" 
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            </div>
          ) : (
            <span className="text-muted small">Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
};