import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from '../../components/ThemeToggle'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/add', label: 'Add Product', icon: PlusCircle },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { dark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        dark ? 'bg-[#08080c] text-white' : 'bg-[#FFF3D6] text-[#382719]'
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r p-6 flex flex-col justify-between ${
          dark
            ? 'bg-[#0d0d12] border-white/10'
            : 'bg-[#FFF9EC] border-[#FFAA33]/30'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
  <img
    src="/logo.png"
    alt="The Bindass Bros Logo"
    className="h-10 w-10 object-contain shrink-0 logo-glow-orbit"
  />
  <div>
    <h2 className="text-sm font-black tracking-tight leading-tight">
      THE BINDASS BROS<span className="text-[#FFAA33]">.</span>
    </h2>
    <p className="text-[9px] tracking-[0.25em] opacity-50 mt-0.5">
      ADMIN PANEL
    </p>
  </div>
</div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shrink-0 transition ${
                    isActive
                      ? 'bg-[#FFAA33] text-white'
                      : dark
                        ? 'text-white/70 hover:bg-white/5 hover:text-white'
                        : 'text-[#382719]/70 hover:bg-[#FFAA33]/10 hover:text-[#382719]'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex flex-col gap-2 pt-6 border-t border-current/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm opacity-70 hover:opacity-100 hover:text-[#FFAA33] transition"
          >
            <ExternalLink size={16} /> View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}