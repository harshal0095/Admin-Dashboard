import { useEffect, useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import Slidebar from './Slidebar.jsx'
import Home from './Home.jsx'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

function App() {
  const [token, setToken] = useState(localStorage.getItem('dashboard_token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('dashboard_user') || 'null'))
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [page, setPage] = useState('dashboard')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchDashboard() {
    if (!token) return
    setLoading(true)
    try {
      const [statsRes, usersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!statsRes.ok || !usersRes.ok || !productsRes.ok) {
        logout()
        return
      }

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const productsData = await productsRes.json()
      setStats(statsData)
      setUsers(usersData)
      setProducts(productsData)
    } catch (err) {
      setError('System connection failure.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboard()
    }
  }, [token])

  async function handleLogin(email, password) {
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Verification Failed')
        return
      }

      localStorage.setItem('dashboard_token', data.token)
      localStorage.setItem('dashboard_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      setPage('dashboard')
    } catch (err) {
      setError('Connection dropped.')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('dashboard_token')
    localStorage.removeItem('dashboard_user')
    setToken('')
    setUser(null)
    setStats(null)
    setUsers([])
    setProducts([])
    setPage('dashboard')
  }

  async function handleDeleteUser(id) {
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setUsers(users.filter((userItem) => userItem._id !== id))
      }
    } catch (err) {
      setError('Operation failed.')
    }
  }

  async function handleAddProduct(product) {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      })
      if (response.ok) fetchDashboard()
    } catch (err) {
      setError('Operation failed.')
    }
  }

  async function handleUpdateProduct(id, product) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      })
      if (response.ok) fetchDashboard()
    } catch (err) {
      setError('Operation failed.')
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) fetchDashboard()
    } catch (err) {
      setError('Operation failed.')
    }
  }

  if (!token) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <h1>TRINETRA</h1>
          <div className="login-subtitle">System Access Point</div>
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Slidebar active={page} onNavigate={setPage} />
      <div className="main-panel">
        <Header user={user} onLogout={logout} />
        <Home
          stats={stats}
          users={users}
          products={products}
          page={page}
          onDeleteUser={handleDeleteUser}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('harshalpanchal4517@gmail.com')
  const [password, setPassword] = useState('Harshu@#0095')

  return (
    <form className="login-form" onSubmit={(event) => {
      event.preventDefault()
      onSubmit(email, password)
    }}>
      <div className="login-field">
        <label>Admin Access Identity</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="EMAIL" required />
      </div>
      <div className="login-field">
        <label>Secret Access Key</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="PASSWORD" required />
      </div>
      {error && <div className="form-error" style={{color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem'}}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'OPENING EYE...' : 'ENTER SYSTEM'}
      </button>
    </form>
  )
}

export default App
