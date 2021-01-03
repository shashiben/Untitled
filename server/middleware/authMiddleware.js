import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(`Got error at middlware is ${error}`)
      res.status(401)
      throw new Error(`Not Authorized Token failed`)
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not Authorized due to absent of token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.statsu(401)
    throw new Error('Not Authorized')
  }
}

export { protect, admin }
