import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'

export default function MobileProductRow({ products, dark, resetKey }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = 0
    }
    const timer = setTimeout(updateArrows, 60)
    window.addEventListener('resize', updateArrows)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateArrows)
    }
  }, [products, resetKey])

  const scrollByAmount = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {/* LEFT GLOWING ARROW (MOBILE ONLY) */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount('left')}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: [1, 1.15, 1] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`md:hidden absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#FFAA33]/70 shadow-[0_0_16px_rgba(255,170,51,0.75)] backdrop-blur-md ${
              dark ? 'bg-[#08080c]/85 text-[#FFAA33]' : 'bg-[#FFF3D6]/90 text-[#D97706]'
            }`}
          >
            <ChevronLeft size={20} strokeWidth={2.8} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* RIGHT GLOWING ARROW (MOBILE ONLY) */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount('right')}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: [1, 1.15, 1] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`md:hidden absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#FFAA33]/70 shadow-[0_0_16px_rgba(255,170,51,0.75)] backdrop-blur-md ${
              dark ? 'bg-[#08080c]/85 text-[#FFAA33]' : 'bg-[#FFF3D6]/90 text-[#D97706]'
            }`}
          >
            <ChevronRight size={20} strokeWidth={2.8} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* MOBILE: HORIZONTAL SCROLL (2 CARDS VISIBLE) | DESKTOP: NORMAL GRID */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[calc(50%-6px)] shrink-0 snap-start md:w-auto"
          >
            <ProductCard product={product} dark={dark} />
          </div>
        ))}
      </div>
    </div>
  )
}