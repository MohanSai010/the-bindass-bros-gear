import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Trash2, Eye, EyeOff, ExternalLink, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function Products() {
  const { dark } = useTheme()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const toggleActive = async (product) => {
    await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    fetchProducts()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const cardClass = dark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-[#FFF9EC] border-[#FFAA33]/30'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">All Products</h1>
          <p className="text-sm opacity-60 mt-1">
            Manage your setup gear and recommendations.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 bg-[#FFAA33] hover:bg-[#F09518] text-white px-5 py-3 rounded-xl text-sm font-semibold transition w-fit"
        >
          <PlusCircle size={17} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-sm opacity-60">Loading products...</p>
      ) : products.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center ${cardClass}`}>
          <p className="opacity-60 mb-4">No products added yet.</p>
          <Link
            to="/admin/products/add"
            className="text-sm font-semibold text-[#FFAA33] hover:underline"
          >
            + Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardClass}`}
            >
              <div className="flex items-center gap-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-black/40 p-1"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#FFAA33]/15 flex items-center justify-center text-xs text-[#FFAA33]">
                    No Img
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{product.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFAA33]/15 text-[#FFAA33] font-semibold">
                      {product.product_type}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">
                    {product.categories?.name || 'No Category'} • {product.price} • {product.platform}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="p-2.5 rounded-xl border border-current/15 hover:text-[#FFAA33] transition"
                  title="Edit Product"
                >
                  <Pencil size={16} />
                </Link>

                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-current/15 hover:text-[#FFAA33] transition"
                  title="Open Link"
                >
                  <ExternalLink size={16} />
                </a>

                <button
                  onClick={() => toggleActive(product)}
                  className="p-2.5 rounded-xl border border-current/15 hover:text-[#FFAA33] transition cursor-pointer"
                  title={product.is_active ? 'Hide Product' : 'Show Product'}
                >
                  {product.is_active ? <Eye size={16} /> : <EyeOff size={16} className="opacity-40" />}
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}