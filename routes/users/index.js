const router = require('express').Router()

const User = require('../../models/User')

const withAuth = require('../../middlewares/authMiddleware')
const { extractIdfromRequestAuthHeader } = require('../../helpers/TokenHelper')

router.route('/')
  .get(withAuth, (req, res) => {
    const id = extractIdfromRequestAuthHeader(req)

    User.findById(id).select('-password')
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error))
  })

module.exports = router
