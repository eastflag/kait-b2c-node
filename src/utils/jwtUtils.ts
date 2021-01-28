import jwtOptions from '../config/jwtOptions';
const jwt = require('jsonwebtoken');

const jwtUtils = {
  verifyToken: async (req, res, next) => {
    const token = req.headers['x-access-token']
    let decoded;
    try {
      // verify를 통해 값 decode!
      decoded = jwt.verify(token, jwtOptions.secretKey);
      console.log(decoded);

      if (decoded) {
        next();
      } else {
        res.status(401).json({ error: 'unauthorized' });
      }
    } catch (err) {
      if (err.message === 'jwt expired') {
        console.log('expired token');
        res.status(401).json({ error: 'expired token' });
      } else if (err.message === 'invalid token') {
        console.log('invalid token');
        res.status(401).json({ error: 'invalid token' });
      } else {
        console.log("invalid token");
        res.status(401).json({ error: 'invalid token' });
      }
    }
  }
}

export default jwtUtils;