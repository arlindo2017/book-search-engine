const jwt = require('jsonwebtoken');
//Define token expiration
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';
//Authmiddleware being passed into context
module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  // Token used for certain functions in frontend
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
