const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ error: "No token provided" });
    
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Token invalid" });
  }
};