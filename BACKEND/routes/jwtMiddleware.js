const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

module.exports = {
  checkJwt : (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }
  
    try {
        let jwtBearer = token.split(' ')[1];
        let jwtPayload = jwt.verify(jwtBearer, ACCESS_TOKEN_SECRET,
        {
          algorithms: ['HS256'],
          clockTolerance: 0,
          ignoreExpiration: false,
          ignoreNotBefore: false
        });
        req.user = jwtPayload;
        req.token = jwtPayload;
        next();
    } catch (error) {
        return res.status(401).type('json').send(JSON.stringify({ message: 'Invalid token' }));
    }
  }
}