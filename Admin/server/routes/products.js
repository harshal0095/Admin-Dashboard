import express from 'express'
import Product from '../models/Product.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products', error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body
    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    const newProduct = new Product({ name, price, stock })
    await newProduct.save()
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Unable to create product', error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock } = req.body
    const product = await Product.findByIdAndUpdate(req.params.id, { name, price, stock }, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Unable to update product', error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete product', error: error.message })
  }
})

export default router
