import { useState } from 'react'
import { BsEyeFill, BsTrashFill, BsPlusCircleFill, BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'

export default function Products({ products, onAdd, onUpdate, onDelete, error }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' })

  function handleEdit(product) {
    setEditingId(product._id)
    setFormData({ name: product.name, price: product.price, stock: product.stock })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setFormData({ name: '', price: '', stock: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      onUpdate(editingId, { ...formData, price: Number(formData.price), stock: Number(formData.stock) })
      setEditingId(null)
    } else {
      onAdd({ ...formData, price: Number(formData.price), stock: Number(formData.stock) })
    }
    setFormData({ name: '', price: '', stock: '' })
  }

  return (
    <div className="content-shell">
      <section className="section-header">
        <h2>Product Ecosystem</h2>
        <p style={{color: 'var(--text-muted)'}}>Manage your inventory assets with precision.</p>
      </section>

      {error && <div className="content-error" style={{color: 'var(--secondary)', marginBottom: '24px', fontWeight: 700}}>{error}</div>}

      <div className="form-card">
        <h3>
          {editingId ? 'Refine Asset' : 'Register New Asset'}
        </h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Asset Name</label>
            <input
              type="text"
              placeholder="e.g. Quantum Processor"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit Price ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Inventory Count</label>
            <input
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>
          <button type="submit">
            {editingId ? <><BsCheckCircleFill /> UPDATE</> : <><BsPlusCircleFill /> ADD ASSET</>}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="logout-button delete-button">
              CANCEL
            </button>
          )}
        </form>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Identity</th>
              <th>Value</th>
              <th>Reserve</th>
              <th style={{textAlign: 'right'}}>Control</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={{fontWeight: 700, color: '#fff'}}>{product.name}</td>
                <td style={{color: 'var(--primary)', fontWeight: 800}}>${product.price}</td>
                <td>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    background: product.stock < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                    color: product.stock < 10 ? '#ef4444' : 'var(--primary)',
                    fontWeight: 700,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {product.stock} UNITS
                  </span>
                </td>
                <td style={{textAlign: 'right'}}>
                  <button 
                    className="edit-button" 
                    onClick={() => handleEdit(product)} 
                    style={{
                      marginRight: '12px', 
                      padding: '10px 18px', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'var(--transition)'
                    }}
                  >
                    REFINE
                  </button>
                  <button className="logout-button delete-button" onClick={() => onDelete(product._id)} style={{padding: '10px 16px'}}>
                    <BsTrashFill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
