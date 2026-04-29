import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiUserPlus, FiUser, FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        // Flatten Django validation errors
        const messages = Object.values(data).flat().join(' ');
        setError(messages || 'Registration failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <div className="auth-card auth-card-wide" id="register-card">
        <Link to="/" className="auth-logo">
          <FiActivity />
          <span>BillingAI</span>
        </Link>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to start predicting healthcare costs</p>

        {error && (
          <div className="auth-error" id="register-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="auth-form-row">
            <div className="auth-input-group">
              <FiUser className="auth-input-icon" />
              <input
                type="text"
                name="first_name"
                id="register-firstname"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-group">
              <FiUser className="auth-input-icon" />
              <input
                type="text"
                name="last_name"
                id="register-lastname"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <FiUser className="auth-input-icon" />
            <input
              type="text"
              name="username"
              id="register-username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="auth-input-group">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              name="email"
              id="register-email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form-row">
            <div className="auth-input-group">
              <FiLock className="auth-input-icon" />
              <input
                type="password"
                name="password"
                id="register-password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-input-group">
              <FiLock className="auth-input-icon" />
              <input
                type="password"
                name="password2"
                id="register-password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="register-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-spinner" />
            ) : (
              <>
                <FiUserPlus /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
