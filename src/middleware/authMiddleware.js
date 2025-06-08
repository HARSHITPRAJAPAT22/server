import jwt from "jsonwebtoken";

const auth = function (req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // ✅ Define the secret before using it
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return res.status(500).json({ message: 'Internal server error' });
  }
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid token' });
  }
};

export default auth;
