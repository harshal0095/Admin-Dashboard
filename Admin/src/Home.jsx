import Products from './Products.jsx'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const activityData = [
  { day: 'Mo', visits: 8, sales: 5 },
  { day: 'Tu', visits: 28, sales: 18 },
  { day: 'We', visits: 26, sales: 20 },
  { day: 'Th', visits: 18, sales: 15 },
  { day: 'Fr', visits: 22, sales: 12 },
  { day: 'Sa', visits: 12, sales: 10 },
  { day: 'Su', visits: 10, sales: 8 }
]

export default function Home({ stats, users, products, onDeleteUser, onAddProduct, onUpdateProduct, onDeleteProduct, page, loading, error }) {
  if (!stats && loading) {
    return <div className="content-shell">System Loading…</div>
  }

  if (page === 'users') {
    return (
      <div className="content-shell">
        <section className="section-header">
          <h2>Registered Entities</h2>
        </section>

        {error && <div className="content-error" style={{color: 'var(--secondary)', marginBottom: '20px'}}>{error}</div>}

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Identity</th>
                <th>Access Point</th>
                <th>Privilege</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{fontWeight: 700}}>{user.name}</td>
                  <td>{user.email}</td>
                  <td style={{color: 'var(--primary)'}}>{user.role}</td>
                  <td>
                    <button className="delete-button" onClick={() => onDeleteUser(user._id)}>
                      Purge
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

  if (page === 'products') {
    return (
      <Products
        products={products}
        onAdd={onAddProduct}
        onUpdate={onUpdateProduct}
        onDelete={onDeleteProduct}
        error={error}
      />
    )
  }

  return (
    <div className="content-shell">
      <section className="section-header">
        <h2>System Pulse</h2>
      </section>

      {error && <div className="content-error">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card">
          <span>Active Nodes</span>
          <strong>{stats?.totalUsers ?? 0}</strong>
        </div>
        <div className="stat-card">
          <span>Resource Count</span>
          <strong>{stats?.totalProducts ?? 0}</strong>
        </div>
        <div className="stat-card">
          <span>Flux Volume</span>
          <strong>{stats?.totalOrders ?? 0}</strong>
        </div>
        <div className="stat-card">
          <span>Credit Reserve</span>
          <strong>${stats?.totalRevenue ?? 0}K</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3 style={{marginBottom: '20px', color: 'var(--text-muted)'}}>Flow Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: '#121212', 
                  border: '1px solid var(--border)',
                  borderRadius: '10px'
                }} 
              />
              <Area type="monotone" dataKey="visits" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorPulse)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
