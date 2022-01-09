const jwt = require('jsonwebtoken')

const withAuth = (req, res, next) => {

  if (req.headers.authorization) {
  
    const token = req.headers.authorization.split(' ')[1]
   
    if (!token) return res.status(401).send('Unauthorized: No token provided')
    
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.status(401).send('Unauthorized : Invalid token')
    
      const now = new Date().getTime() / 1000
    
      if (decoded.exp < now) return res.status(401).send('Unauthorized: Expired token')
      next()
    })
  } else {
    res.status(401).send('Unauthorized: No Authorization Header')
  }
}

module.exports = withAuth