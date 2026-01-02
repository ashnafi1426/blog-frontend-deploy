import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validatePassword, validateEmail, validateUsername, validateName, getPasswordStrength } from "../utils/validation";
import "./Auth.css";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null });
    }
    
    // Show password strength indicator when typing password
    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate firstname
    const firstnameValidation = validateName(formData.firstname, 'First name');
    if (!firstnameValidation.isValid) {
      errors.firstname = firstnameValidation.errors[0];
    }
    
    // Validate lastname
    const lastnameValidation = validateName(formData.lastname, 'Last name');
    if (!lastnameValidation.isValid) {
      errors.lastname = lastnameValidation.errors[0];
    }
    
    // Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.errors[0];
    }
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors[0];
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-card">
      <h1 className="auth-title">Join Medium</h1>
      <p className="auth-subtitle">
        Create an account to start writing and sharing
      </p>

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-grid">
          <div className="input-group">
            <input 
              name="firstname" 
              placeholder="First name" 
              value={formData.firstname}
              onChange={handleChange} 
              className={fieldErrors.firstname ? 'error' : ''}
              required 
            />
            {fieldErrors.firstname && <span className="field-error">{fieldErrors.firstname}</span>}
          </div>
          
          <div className="input-group">
            <input 
              name="lastname" 
              placeholder="Last name" 
              value={formData.lastname}
              onChange={handleChange} 
              className={fieldErrors.lastname ? 'error' : ''}
              required 
            />
            {fieldErrors.lastname && <span className="field-error">{fieldErrors.lastname}</span>}
          </div>
        </div>

        <div className="input-group">
          <input 
            name="username" 
            placeholder="Username" 
            value={formData.username}
            onChange={handleChange} 
            className={fieldErrors.username ? 'error' : ''}
            required 
          />
          {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
        </div>

        <div className="input-group">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange} 
            className={fieldErrors.email ? 'error' : ''}
            required 
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="input-group">
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange} 
            className={fieldErrors.password ? 'error' : ''}
            required 
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          
          {showPasswordStrength && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: passwordStrength.color }}>
                {passwordStrength.strength}
              </span>
              
              <div className="password-requirements">
                <div className={passwordStrength.checks.length ? 'requirement met' : 'requirement'}>
                  ✓ At least 8 characters
                </div>
                <div className={passwordStrength.checks.uppercase ? 'requirement met' : 'requirement'}>
                  ✓ One uppercase letter
                </div>
                <div className={passwordStrength.checks.lowercase ? 'requirement met' : 'requirement'}>
                  ✓ One lowercase letter
                </div>
                <div className={passwordStrength.checks.number ? 'requirement met' : 'requirement'}>
                  ✓ One number
                </div>
                <div className={passwordStrength.checks.special ? 'requirement met' : 'requirement'}>
                  ✓ One special character
                </div>
              </div>
            </div>
          )}
        </div>

        <input 
          name="bio" 
          placeholder="Short bio (optional)" 
          value={formData.bio}
          onChange={handleChange} 
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-footer">
        Already a member? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default SignUp;
