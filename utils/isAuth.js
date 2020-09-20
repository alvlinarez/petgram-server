const jwt = require('jsonwebtoken');
const config = require('../config/env');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not signed in. Unauthorized' });
  }
  try {
    const { sub: id, name, email } = jwt.verify(token, config.jwtSecret);
    req.user = { id, name, email };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
