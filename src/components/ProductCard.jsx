import { motion } from 'framer-motion'
import { ArrowUpRight, Package } from 'lucide-react'

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value).trim()
  if (str.startsWith('₹') || str.startsWith('$')) return str
  const num = Number(str.replace(/,/g, ''))
  return Number.isNaN(num) ? `₹${str}` : `₹${num.toLocaleString('en-IN')}`
}

export default function ProductCard({ product, dark }) {
  const formattedPrice = formatPrice(product.price)
  const formattedOriginal = formatPrice(product.original_price)

  return (
    <motion.a
      href={product.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        dark
          ? 'border-white/10 bg-[#121218]/90 hover:border-[#FFAA33]/50 hover:shadow-[0_12px_35px_rgba(255,170,51,0.12)]'
          : 'border-[#FFAA33]/30 bg-white/95 hover:border-[#FFAA33] hover:shadow-[0_12px_35px_rgba(217,119,6,0.12)]'
      }`}
    >
      {/* IMAGE FRAME */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${
          dark
            ? 'bg-gradient-to-b from-[#1d1812] to-[#0d0d12]'
            : 'bg-gradient-to-b from-[#FFF6E0] to-[#FDEBC8]'
        }`}
      >
        {/* TOP BADGE */}
        {product.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FFAA33] px-2.5 py-1 text-[9px] md:text-[10px] font-extrabold tracking-[0.14em] text-[#1a1105] shadow-md">
            {product.tag}
          </span>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-5 pt-9 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 pt-5 opacity-45">
            <Package size={28} className="text-[#FFAA33]" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#FFAA33]">
            {product.category || 'GEAR'}
          </p>

          <h3 className="mt-1.5 line-clamp-1 text-base md:text-lg font-bold tracking-tight">
            {product.name}
          </h3>

          <p
            className={`mt-1 line-clamp-2 text-xs md:text-sm leading-relaxed ${
              dark ? 'text-white/55' : 'text-[#795A38]'
            }`}
          >
            {product.description}
          </p>
        </div>

        {/* PRICE + CTA */}
        <div
          className={`mt-4 flex items-center justify-between gap-2 border-t pt-3.5 ${
            dark ? 'border-white/10' : 'border-[#FFAA33]/20'
          }`}
        >
          <div className="flex flex-col">
            {formattedOriginal && (
              <span
                className={`relative w-fit text-[11px] font-medium ${
                  dark ? 'text-white/45' : 'text-[#795A38]/70'
                }`}
              >
                {formattedOriginal}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: 'easeInOut',
                  }}
                  style={{ originX: 0 }}
                  className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-red-500"
                />
              </span>
            )}

            <span className="font-display text-lg md:text-xl font-extrabold tracking-tight text-[#FFAA33]">
              {formattedPrice}
            </span>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-300 ${
              dark
                ? 'bg-[#FFAA33]/15 text-[#FFAA33] group-hover:bg-[#FFAA33] group-hover:text-black'
                : 'bg-[#FFAA33]/20 text-[#9A5500] group-hover:bg-[#FFAA33] group-hover:text-white'
            }`}
          >
            View
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </motion.a>
  )
}