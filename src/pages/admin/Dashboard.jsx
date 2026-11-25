import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Wrench, Star, CheckCircle, PlusCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function Dashboard() {
  const { dark } = useTheme()
  const [stats, setStats] = useState({
    total: 0,
    using: 0,
    recommended: 0,
    featured: 0,
    active: 0,
  })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setStats({
          total: data.length,
          using: data.filter((p) => p.product_type === 'USING').length,
          recommended: data.filter((p) => p.product_type === 'RECOMMENDED').length,
          featured: data.filter((p) => p.is_featured).length,
          active: data.filter((p) => p.is_active).length,
        })
        setRecent(data.slice(0, 5))
      }
      setLoading(false)
    }
    loadDashboard()
  }, [])

  const cardClass = dark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-[#FFF9EC] border-[#FFAA33]/30'

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: Package },
    { label: 'Products I Use', value: stats.using, icon: Wrench },
    { label: 'Recommended', value: stats.recommended, icon: Star },
    { label: 'Active Products', value: stats.active, icon: CheckCircle },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-sm opacity-60 mt-1">
            Overview of your gear and recommendations.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 bg-[#FFAA33] hover:bg-[#F09518] text-white px-5 py-3 rounded-xl text-sm font-semibold transition w-fit"
        >
          <PlusCircle size={17} /> Add New Product
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`rounded-2xl border p-5 ${cardClass}`}>
            <Icon size={20} className="text-[#FFAA33] mb-3" />
            <p className="text-3xl font-black">{loading ? '...' : value}</p>
            <p className="text-xs opacity-60 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* RECENTLY ADDED */}
      <div className={`rounded-2xl border p-6 ${cardClass}`}>
        <h2 className="text-lg font-bold mb-4">Recently Added Products</h2>

        {loading ? (
          <p className="text-sm opacity-60">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-sm opacity-60">
            No products yet. Click "Add New Product" to add your first item!
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-current/10 last:border-0"
              >
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs opacity-60">
                    {item.product_type} • {item.price}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                    item.is_active
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {item.is_active ? 'ACTIVE' : 'HIDDEN'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}