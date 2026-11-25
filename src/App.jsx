import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
  X,
  Play,
  Sparkles,
} from 'lucide-react'

import MobileProductRow from './components/MobileProductRow'
import TypingHeroWord from './components/TypingHeroWord'
import ThemeToggle from './components/ThemeToggle'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from './contexts/ThemeContext'
import { supabase, isSupabaseConfigured } from './lib/supabase'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import AddProduct from './pages/admin/AddProduct'
import Categories from './pages/admin/Categories'
import Settings from './pages/admin/Settings'

function HomePage() {
  const { dark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [productsIUse, setProductsIUse] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [siteSettings, setSiteSettings] = useState({
    creator_bio:
      'Welcome to The Bindass Bros. This is where we share our creative journey, favourite tools and the gear we believe in.',
    youtube_url: '',
    instagram_url: '',
    courses_url: '',
    contact_email: '',
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function loadData() {
      const [{ data: prodData }, { data: settingsData }] = await Promise.all([
        supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
      ])

      if (prodData) {
        const formatted = prodData.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          original_price: p.original_price,
          image: p.image_url,
          url: p.product_url,
          category: p.categories?.name || 'GEAR',
          product_type: p.product_type,
          tag: p.product_type === 'USING' ? 'PERSONALLY USED' : 'OUR PICK',
        }))

        setProductsIUse(formatted.filter((p) => p.product_type === 'USING'))
        const recs = formatted.filter((p) => p.product_type === 'RECOMMENDED')
        setRecommendations(recs)

        const uniqueCats = ['All', ...new Set(recs.map((r) => r.category))]
        setCategories(uniqueCats)
      }

      if (settingsData && settingsData.length > 0) {
        const map = {}
        settingsData.forEach((row) => {
          if (row.setting_value) map[row.setting_key] = row.setting_value
        })
        setSiteSettings((prev) => ({ ...prev, ...map }))
      }
    }

    loadData()
  }, [])

  const filteredRecommendations = recommendations.filter(
    (product) =>
      selectedCategory === 'All' || product.category === selectedCategory
  )

  const theme = dark
    ? 'bg-[#08080c] text-white'
    : 'bg-[#FFF3D6] text-[#382719]'

  const muted = dark ? 'text-white/50' : 'text-[#795A38]'

  return (
    <main className={`${theme} min-h-screen overflow-x-hidden pt-[74px] md:pt-[82px] transition-colors duration-500`}>
      {/* AMBIENT BACKGROUND */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb one" />
        <div className="ambient-orb two" />
        <div className="ambient-grid" />
        <div className="ambient-lines" />
      </div>

      {/* NAVIGATION */}
   <nav
     className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-2 px-4 md:px-12 py-3.5 md:py-4 backdrop-blur-xl border-b ${
       dark
         ? 'bg-[#08080c]/90 border-white/10'
         : 'bg-[#FFF3D6]/95 border-[#FFAA33]/30'
     }`}
   >
     <a
       href="#"
       className="flex min-w-0 items-center gap-2.5 md:gap-3 text-sm sm:text-base md:text-xl font-black tracking-tight"
     >
       <img
         src="/logo.png"
         alt="The Bindass Bros Logo"
         className="h-11 w-11 sm:h-12 sm:w-12 md:h-16 md:w-16 shrink-0 object-contain logo-glow-orbit"
       />
       <span className="truncate">
         THE BINDASS BROS<span className="text-[#FFAA33]">.</span>
       </span>
     </a>

     <div className="hidden md:flex items-center gap-10 text-sm font-medium">
       {[
         { label: 'Home', href: '#home' },
         { label: 'My Setup', href: '#setup' },
         { label: 'My Picks', href: '#picks' },
         { label: 'About', href: '#about' },
       ].map((link) => (
         <a key={link.href} href={link.href} className="group relative py-1">
           <span className="relative block overflow-hidden">
             <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
               {link.label}
             </span>
             <span
               aria-hidden="true"
               className="absolute inset-0 block text-[#FFAA33] transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0"
             >
               {link.label}
             </span>
           </span>
           <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-[#FFAA33] to-[#FFD27A] transition-all duration-300 ease-out group-hover:w-full" />
         </a>
       ))}
     </div>

     <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
       <ThemeToggle />

       <button
         className="md:hidden p-1.5"
         onClick={() => setMenuOpen(!menuOpen)}
         aria-label="Toggle menu"
       >
         {menuOpen ? <X size={22} /> : <Menu size={22} />}
       </button>
     </div>
   </nav>

      {/* ANIMATED MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`md:hidden fixed top-[82px] left-0 right-0 z-[90] flex flex-col gap-2 p-5 border-b border-current/10 backdrop-blur-xl shadow-2xl ${
              dark ? 'bg-[#101016]/95' : 'bg-[#FFF3D6]/95'
            }`}
          >
            {[
              { label: 'Home', href: '#home' },
              { label: 'My Setup', href: '#setup' },
              { label: 'My Picks', href: '#picks' },
              { label: 'About', href: '#about' },
            ].map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[#FFAA33]/15 hover:text-[#FFAA33] transition"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

     {/* HERO */}
      <section id="home" className="relative z-10 min-h-0 md:min-h-[720px] flex items-start md:items-center px-6 md:px-16 pt-10 pb-16 md:py-24">
        <div className="absolute top-10 right-[-120px] w-[450px] h-[450px] bg-[#FFAA33]/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-10"
          >
            <Sparkles size={15} className="text-[#FFAA33]" />
            <span className={`text-xs tracking-[0.3em] uppercase ${muted}`}>
              Welcome to our creative world
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-[3.25rem] sm:text-[4rem] md:text-[clamp(2.5rem,8vw,7.5rem)] font-black leading-[0.95] tracking-[-0.06em]"
          >
            THE GEAR
            <br />
            BEHIND THE
            <br />
            <TypingHeroWord />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col md:flex-row md:items-center gap-8"
          >
            <p className={`max-w-md text-base md:text-lg leading-relaxed ${muted}`}>
              Discover the tools we use, the products we love,
              and the gear that brings our creative ideas to life.
            </p>

            <a
              href="#setup"
              className="group inline-flex items-center gap-3 bg-[#FFAA33] hover:bg-[#F09518] text-white px-7 py-4 rounded-full text-sm font-semibold transition w-fit"
            >
              Explore our gear
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className={`mt-10 md:mt-10 flex items-center gap-3 text-xs tracking-widest ${muted}`}
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex"
            >
              <ArrowDown size={16} />
            </motion.span>
            SCROLL TO EXPLORE
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className={`w-48 h-48 rounded-full border ${dark ? 'border-white/10' : 'border-black/10'} flex items-center justify-center`}>
            <div className="text-center">
              <Play size={24} className="mx-auto mb-3 text-[#FFAA33]" />
              <p className="text-xs tracking-widest">CREATE</p>
              <p className="text-xs tracking-widest opacity-50">INSPIRE</p>
              <p className="text-xs tracking-widest opacity-50">REPEAT</p>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE MOVING TEXT STRIP */}
      <section className="relative z-10 border-y border-current/10 py-6 overflow-hidden">
        <div className="marquee-track">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="marquee-group">
              <span>CREATIVITY</span>
              <span className="marquee-star">✳</span>
              <span>TECHNOLOGY</span>
              <span className="marquee-star">✳</span>
              <span>OUR SETUP</span>
              <span className="marquee-star">✳</span>
              <span>RECOMMENDATIONS</span>
              <span className="marquee-star">✳</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS I USE */}
      <section id="setup" className="relative z-10 px-6 md:px-16 py-28">
        <div className="mb-14">
          <p className="text-[#FFAA33] text-xs tracking-[0.3em] mb-4">
            MY PERSONAL SETUP
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Products I Use<span className="text-[#FFAA33]">.</span>
          </h2>
          <p className={`mt-4 ${muted}`}>
            The actual gear behind our content creation.
          </p>
        </div>

        {productsIUse.length === 0 ? (
          <p className={`text-sm ${muted}`}>
            No setup products added yet. Add them from the Admin Panel!
          </p>
        ) : (
          <MobileProductRow products={productsIUse} dark={dark} resetKey="setup" />
        )}
      </section>

      {/* MY RECOMMENDATIONS */}
      <section id="picks" className={`relative z-10 px-6 md:px-16 py-28 border-y border-current/10 ${dark ? 'bg-white/[0.02]' : 'bg-black/[0.025]'}`}>
        <div className="mb-14">
          <p className="text-[#FFAA33] text-xs tracking-[0.3em] mb-4">
            HANDPICKED FOR YOU
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            My Recommendations<span className="text-[#FFAA33]">.</span>
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-4 mt-8 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? dark
                      ? 'bg-[#FFAA33] text-white'
                      : 'bg-orange-500 text-white'
                    : dark
                      ? 'border border-white/15 text-white/60 hover:border-[#FFAA33]'
                      : 'border border-orange-200 text-[#76512d] hover:bg-orange-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className={`mt-4 ${muted}`}>
            Products we recommend for fellow creators and tech lovers.
          </p>
        </div>

        {filteredRecommendations.length === 0 ? (
          <p className={`text-sm ${muted}`}>
            No recommendations added yet. Add them from the Admin Panel!
          </p>
        ) : (
          <MobileProductRow
            products={filteredRecommendations}
            dark={dark}
            resetKey={selectedCategory}
          />
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 px-6 md:px-16 py-28 text-center">
        <p className="text-[#FFAA33] text-xs tracking-[0.3em] mb-5">WHO WE ARE</p>
        <h2 className="text-4xl md:text-7xl font-black tracking-tight">
          We create.
          <br />
          We experiment.
          <br />
          <span className="text-[#FFAA33]">We share.</span>
        </h2>
        <p className={`max-w-xl mx-auto mt-8 leading-relaxed ${muted}`}>
          {siteSettings.creator_bio}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {siteSettings.youtube_url && (
            <a
              href={siteSettings.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#FFAA33]/40 px-6 py-2.5 text-sm font-semibold hover:bg-[#FFAA33] hover:text-white transition"
            >
              YouTube <ArrowUpRight size={15} />
            </a>
          )}
          {siteSettings.instagram_url && (
            <a
              href={siteSettings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#FFAA33]/40 px-6 py-2.5 text-sm font-semibold hover:bg-[#FFAA33] hover:text-white transition"
            >
              Instagram <ArrowUpRight size={15} />
            </a>
          )}
          {siteSettings.contact_email && (
            <a
              href={`mailto:${siteSettings.contact_email}`}
              className="inline-flex items-center gap-2 rounded-full border border-current/20 px-6 py-2.5 text-sm font-semibold hover:border-[#FFAA33] hover:text-[#FFAA33] transition"
            >
              Contact Us
            </a>
          )}
        </div>

        {/* COURSES BY US BUTTON WITH FAST GOLDEN GLARE */}
        {siteSettings.courses_url && (
          <div className="mt-6 flex justify-center">
            <a
              href={siteSettings.courses_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#E68A00] via-[#FFAA33] to-[#F59E0B] px-7 py-3.5 text-white shadow-[0_0_25px_rgba(255,170,51,0.35)] hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                <span className="font-display text-xs md:text-sm font-extrabold tracking-[0.18em]">
                  COURSES BY US
                </span>
                <span className="h-4 w-[1px] bg-white/40" />
                <span className="font-serif italic text-xs md:text-sm font-semibold tracking-wider text-[#FFF7CC]">
                  THE BINDASS BROS
                </span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>

              {/* Fast Golden Glare */}
              <motion.span
                aria-hidden="true"
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                transition={{
                  duration: 1.0,
                  repeat: Infinity,
                  repeatDelay: 0.9,
                  ease: 'easeInOut',
                }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-25 bg-gradient-to-r from-transparent via-[#FFF7CC]/85 to-transparent"
              />
            </a>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 md:px-16 py-9 border-t border-current/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-3 font-black tracking-tight shrink-0">
          <img
            src="/logo.png"
            alt="The Bindass Bros Logo"
            className="h-14 w-14 object-contain logo-glow-orbit"
          />
          <span>
            THE BINDASS BROS<span className="text-[#FFAA33]">.</span>
          </span>
        </div>

        <p className={`text-xs max-w-md ${muted}`}>
          Purchasing through these links gives us a small commission, which helps us make more unique and fun content!
        </p>

        <div className={`text-xs shrink-0 flex flex-col md:items-end gap-1 ${muted}`}>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made by The Bindass Bros</span>
            <motion.span
              animate={{ scale: [1, 1.32, 1] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block"
              aria-label="heart"
            >
              ❤️
            </motion.span>
          </p>
        </div>
      </footer>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App