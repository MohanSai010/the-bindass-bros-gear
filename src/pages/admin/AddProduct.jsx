import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function AddProduct() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category_id: '',
    product_type: 'USING',
    platform: 'Amazon',
    button_text: 'VIEW PRODUCT',
    product_url: '',
    is_featured: false,
    is_active: true,
  })

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(data)
      })

    if (isEditing) {
      supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              name: data.name || '',
              description: data.description || '',
              price: data.price || '',
              original_price: data.original_price || '',
              image_url: data.image_url || '',
              category_id: data.category_id || '',
              product_type: data.product_type || 'USING',
              platform: data.platform || 'Amazon',
              button_text: data.button_text || 'VIEW PRODUCT',
              product_url: data.product_url || '',
              is_featured: Boolean(data.is_featured),
              is_active: Boolean(data.is_active),
            })
          }
        })
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    let imageUrl = form.image_url

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setMessage({ type: 'error', text: 'Image upload failed: ' + uploadError.message })
        setLoading(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      imageUrl = publicData.publicUrl
    }

    const payload = {
      ...form,
      category_id: form.category_id || null,
      image_url: imageUrl,
    }

    const { error } = isEditing
      ? await supabase.from('products').update(payload).eq('id', id)
      : await supabase.from('products').insert([payload])

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: isEditing ? 'Product updated successfully!' : 'Product added successfully!',
      })
      setTimeout(() => navigate('/admin/products'), 1000)
    }
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#FFAA33] transition ${
    dark
      ? 'bg-white/[0.04] border-white/10 text-white'
      : 'bg-white border-[#FFAA33]/30 text-[#382719]'
  }`

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-sm opacity-60 mb-8">
        {isEditing
          ? 'Update the details for this product.'
          : 'Add gear to "My Setup" or "My Recommendations".'}
      </p>

      {message.text && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm ${
            message.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-green-500/10 border-green-500/30 text-green-400'
          }`}
        >
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Product Name *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Sony ZV-E10 Camera"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Why do you use or recommend this?"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Price *
            </label>
            <input
              name="price"
              required
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., ₹59,990"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Original Price (Optional)
            </label>
            <input
              name="original_price"
              value={form.original_price}
              onChange={handleChange}
              placeholder="e.g., ₹69,990"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Section (Product Type) *
            </label>
            <select
              name="product_type"
              value={form.product_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="USING" className="text-black">Products I Use (My Setup)</option>
              <option value="RECOMMENDED" className="text-black">My Recommendations (My Picks)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className="text-black">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-black">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Shopping Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Amazon" className="text-black">Amazon</option>
              <option value="Flipkart" className="text-black">Flipkart</option>
              <option value="Other" className="text-black">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
              Button Text
            </label>
            <select
              name="button_text"
              value={form.button_text}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="VIEW PRODUCT" className="text-black">VIEW PRODUCT</option>
              <option value="BUY NOW" className="text-black">BUY NOW</option>
              <option value="CHECK PRICE" className="text-black">CHECK PRICE</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Affiliate / Product Link *
          </label>
          <input
            name="product_url"
            type="url"
            required
            value={form.product_url}
            onChange={handleChange}
            placeholder="https://amzn.to/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Product Image {isEditing && '(Leave empty to keep current image)'}
          </label>
          <label
            className={`flex items-center justify-center gap-3 rounded-xl border border-dashed p-6 cursor-pointer transition hover:border-[#FFAA33] ${
              dark ? 'border-white/20 bg-white/[0.02]' : 'border-[#FFAA33]/40 bg-white/50'
            }`}
          >
            <Upload size={18} className="text-[#FFAA33]" />
            <span className="text-sm">
              {imageFile ? imageFile.name : 'Click to choose an image (PNG/JPG)'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="accent-[#FFAA33] w-4 h-4"
            />
            Featured Product
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="accent-[#FFAA33] w-4 h-4"
            />
            Active (Visible on site)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#FFAA33] hover:bg-[#F09518] disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition cursor-pointer"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}