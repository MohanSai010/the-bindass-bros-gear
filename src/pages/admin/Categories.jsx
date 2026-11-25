import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function Categories() {
  const { dark } = useTheme()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (data) setCategories(data)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const addCategory = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-')
    await supabase.from('categories').insert([{ name: name.trim(), slug }])

    setName('')
    setLoading(false)
    loadCategories()
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  const cardClass = dark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-[#FFF9EC] border-[#FFAA33]/30'

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">Categories</h1>
      <p className="text-sm opacity-60 mb-8">
        Add categories like Cameras, Mics, Lighting, or Budget Gadgets.
      </p>

      <form onSubmit={addCategory} className="flex gap-3 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name (e.g., Cameras)"
          className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#FFAA33] transition ${
            dark
              ? 'bg-white/[0.04] border-white/10 text-white'
              : 'bg-white border-[#FFAA33]/30 text-[#382719]'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#FFAA33] hover:bg-[#F09518] text-white px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      <div className={`rounded-2xl border p-4 ${cardClass}`}>
        {categories.length === 0 ? (
          <p className="text-sm opacity-60 p-4 text-center">
            No categories yet. Add your first one above!
          </p>
        ) : (
          <div className="divide-y divide-current/10">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-3 px-2"
              >
                <div>
                  <p className="font-semibold text-sm">{cat.name}</p>
                  <p className="text-xs opacity-50">/{cat.slug}</p>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}