const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'helfjdjsfjsdjj';

const users = [];

const login=async (req, res) => {
    const { username, password } = req.body;
  
    // Check if user exists
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  
    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  
    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      // sameSite: 'lax',
    });
  
    res.json({ message: 'Login successful' });
  };
const signup=async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
  
    res.status(201).json({ message: 'User created successfully' });
  }

  const protected=(req, res) => {
    try {
      const user=req.user;
      res.json({ message: 'Protected data', user });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

const authController={
    login,
    signup,
    protected
}

module.exports = authController;