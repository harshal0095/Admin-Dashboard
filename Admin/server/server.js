import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import productsRoutes from './routes/products.js'
import User from './models/User.js'
import Product from './models/Product.js'
import auth from './middleware/auth.js'

dotenv.config()

const app = express()
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: process.env.FRONTEND_URL || 'http://localhost:5173' }
  : undefined
app.use(cors(corsOptions))
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin-dashboard'
const PORT = process.env.PORT || 5001
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

const fallbackUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'prayagkansara05@gmail.com',
    password: await bcrypt.hash('Prayag05@', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Pauline Seitz',
    email: 'pauline@example.com',
    password: await bcrypt.hash('Prayag05@', 10),
    role: 'manager',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Nina Carter',
    email: 'nina@example.com',
    password: await bcrypt.hash('Prayag05@', 10),
    role: 'staff',
    createdAt: new Date().toISOString()
  }
]

const fallbackProducts = [
  { _id: 'p1', name: 'Rocker Phone', price: 299, stock: 82 },
  { _id: 'p2', name: 'Blue Smartwatch', price: 149, stock: 40 },
  { _id: 'p3', name: 'Wireless Headset', price: 79, stock: 58 }
]

const healthHandler = (req, res) => res.json({ status: 'ok' })

app.get('/api/health', healthHandler)

let server = null

const startServer = () => {
  if (server) {
    return
  }

  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the running process or change PORT.`)
      process.exit(1)
    }
    console.error('Server error:', err)
    process.exit(1)
  })
}

const useMockRoutes = () => {
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = fallbackUsers.find((item) => item.email === email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
      expiresIn: '8h'
    })
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } })
  })

  app.get('/api/users', auth, (req, res) => {
    res.json(fallbackUsers.map((user) => ({ ...user, password: undefined })))
  })

  app.get('/api/users/stats', auth, (req, res) => {
    res.json({ totalUsers: fallbackUsers.length, totalProducts: fallbackProducts.length, totalOrders: 94, totalRevenue: 6200 })
  })

  app.delete('/api/users/:id', auth, (req, res) => {
    const index = fallbackUsers.findIndex((user) => user._id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ message: 'User not found' })
    }
    fallbackUsers.splice(index, 1)
    res.json({ message: 'User deleted' })
  })

  app.get('/api/products', auth, (req, res) => {
    res.json(fallbackProducts)
  })

  app.post('/api/products', auth, (req, res) => {
    const { name, price, stock } = req.body
    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    const newProduct = { _id: 'p' + (fallbackProducts.length + 1) + Math.random().toString(36).substring(7), name, price, stock }
    fallbackProducts.unshift(newProduct)
    res.status(201).json(newProduct)
  })

  app.put('/api/products/:id', auth, (req, res) => {
    const { name, price, stock } = req.body
    const index = fallbackProducts.findIndex(p => p._id === req.params.id)
    if (index === -1) return res.status(404).json({ message: 'Product not found' })
    fallbackProducts[index] = { ...fallbackProducts[index], name, price, stock }
    res.json(fallbackProducts[index])
  })

  app.delete('/api/products/:id', auth, (req, res) => {
    const index = fallbackProducts.findIndex(p => p._id === req.params.id)
    if (index === -1) return res.status(404).json({ message: 'Product not found' })
    fallbackProducts.splice(index, 1)
    res.json({ message: 'Product deleted' })
  })
}

const initApp = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')
    app.use('/api/auth', authRoutes)
    app.use('/api/users', usersRoutes)
    app.use('/api/products', productsRoutes)
    startServer()
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    console.warn('Starting backend in mock mode without MongoDB')
    useMockRoutes()
    startServer()
  }
}

process.on('SIGINT', () => {
  if (server) {
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
})

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
})

initApp()
