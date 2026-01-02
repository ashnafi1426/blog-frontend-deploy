// Frontend validation utilities

export const validatePassword = (password) => {
  const errors = [];
  
  // Check minimum length
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    errors: emailRegex.test(email) ? [] : ["Please enter a valid email address"]
  };
};

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  
  if (username && username.length > 30) {
    errors.push("Username must be less than 30 characters");
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name, fieldName = "Name") => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }
  
  if (name && name.length > 50) {
    errors.push(`${fieldName} must be less than 50 characters`);
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push(`${fieldName} can only contain letters and spaces`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  let strength = 'Very Weak';
  let color = '#ff4757';
  
  if (score >= 5) {
    strength = 'Very Strong';
    color = '#2ed573';
  } else if (score >= 4) {
    strength = 'Strong';
    color = '#7bed9f';
  } else if (score >= 3) {
    strength = 'Medium';
    color = '#ffa502';
  } else if (score >= 2) {
    strength = 'Weak';
    color = '#ff6348';
  }
  
  return {
    score,
    strength,
    color,
    checks
  };
};