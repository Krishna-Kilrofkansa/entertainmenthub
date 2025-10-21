import React, { useState,useEffect } from 'react'
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import AuthService from '../services/auth.service.jsx';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        setMessage('');
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    }, [isLogin]);
    if (!isOpen) return null
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (isLogin) {
            AuthService.login(formData.email, formData.password).then(
                (userData) => {
                    // Call the onLogin function passed from App.jsx with the user data
                    onLogin(userData); 
                    onClose(); // Close the modal
                },
                (error) => {
                    const resMessage = (error.response?.data?.message) || error.message || error.toString();
                    setMessage(resMessage);
                    setLoading(false);
                }
            );
        } else { // Handle Register
            if (formData.password !== formData.confirmPassword) {
                setMessage("Passwords do not match!");
                setLoading(false);
                return;
            }
            AuthService.register(formData.name, formData.email, formData.password).then(
                (response) => {
                    setMessage(response.data.message + " You can now sign in.");
                    setLoading(false);
                    setIsLogin(true); // Switch to login view
                },
                (error) => {
                    const resMessage = (error.response?.data?.message) || error.message || error.toString();
                    setMessage(resMessage);
                    setLoading(false);
                }
            );
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <div className="modal-header">
                    <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group password-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="form-group password-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm"></span>}
                        <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        {isLogin ? "New to MovieFinder? " : "Already have an account? "}
                        <button 
                            className="toggle-btn"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up now' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginModal