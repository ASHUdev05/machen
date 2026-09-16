import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { loginUser, fetchProfile } from '../store/authSlice';
import api from '../api/axios';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (isLogin) {
      try {        
        // 1. Dispatch Login and wait for fulfillment
        await dispatch(loginUser({ username, password })).unwrap();

        // 2. Dispatch Fetch Profile immediately
        await dispatch(fetchProfile()).unwrap();
      } catch (err: any) {
        console.error('Login flow failed:', err);
      }
    } else {
      try {
        console.log('Registering user:', username);
        await api.post('/auth/register', { username, password });
        setRegSuccess('Registration successful! Please sign in below.');
        setIsLogin(true);
        setPassword('');
      } catch (err: any) {
        console.error('Registration failed:', err);
        setRegError(err.response?.data?.message || 'Registration failed.');
      }
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <ul className="nav nav-pills nav-justified mb-4">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${isLogin ? 'active' : ''}`}
                  onClick={() => {
                    setIsLogin(true);
                    setRegError(null);
                  }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${!isLogin ? 'active' : ''}`}
                  onClick={() => {
                    setIsLogin(false);
                    setRegError(null);
                  }}
                >
                  Register
                </button>
              </li>
            </ul>

            <h4 className="card-title text-center mb-4 fw-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h4>

            {(error || regError) && (
              <div className="alert alert-danger" role="alert">
                {error || regError}
              </div>
            )}
            {regSuccess && (
              <div className="alert alert-success" role="alert">
                {regSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};