import { BsEyeFill, BsPeople, BsInboxes, BsShieldLock } from 'react-icons/bs'

export default function Slidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo"><BsEyeFill /></span>
        <div className="sidebar-title">TRINETRA</div>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={active === 'dashboard' ? 'nav-item active' : 'nav-item'} 
          onClick={() => onNavigate('dashboard')}
        >
          <BsShieldLock /> <span>Core System</span>
        </button>
        <button 
          className={active === 'users' ? 'nav-item active' : 'nav-item'} 
          onClick={() => onNavigate('users')}
        >
          <BsPeople /> <span>Entities</span>
        </button>
        <button 
          className={active === 'products' ? 'nav-item active' : 'nav-item'} 
          onClick={() => onNavigate('products')}
        >
          <BsInboxes /> <span>Inventory</span>
        </button>
      </nav>

      <div style={{marginTop: 'auto', padding: '16px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '2px'}}>
        STRICT CONFIDENTIALITY
      </div>
    </aside>
  )
}
