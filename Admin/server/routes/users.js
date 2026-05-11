import express from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users', error: error.message })
  }
})

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = 94
    const totalRevenue = 6200
    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue })
  } catch (error) {
    res.status(500).json({ message: 'Unable to load stats', error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete user', error: error.message })
  }
})

export default router
