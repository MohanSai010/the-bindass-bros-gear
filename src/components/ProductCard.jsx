import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

function ProductCard({ product, dark = true }) {
  return (
    <motion.article
      whileHover={{ y: -7 }}
      transition={{ duration: 0.25 }}
      className={`group overflow-hidden rounded-2xl border ${
        dark
          ? 'bg-white/[0.04] border-white/10'
          : 'bg-[#FFF9EC] border-[#FFAA33]/30'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#3B240B] via-[#21180F] to-black flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="text-center">
            <ShoppingBag size={42} className="mx-auto text-[#FFAA33] mb-3" />
            <p className="text-xs tracking-[0.25em] text-white/50">
              PRODUCT IMAGE
            </p>
          </div>
        )}

        {/* BADGE WITH LOOPING GOLDEN GLARE */}
        {product.tag && (
          <span className="absolute top-4 left-4 overflow-hidden bg-gradient-to-r from-[#E68A00] via-[#FFAA33] to-[#F59E0B] text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            <span className="relative z-10">{product.tag}</span>
            <motion.span
              aria-hidden="true"
              initial={{ x: '-150%' }}
              animate={{ x: '250%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1.6,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-25 bg-gradient-to-r from-transparent via-[#FFF7CC]/80 to-transparent"
            />
          </span>
        )}
      </div>

      <div className="p-4 md:p-5">
        <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 ${dark ? 'text-[#FFAA33]' : 'text-orange-700'}`}>
          {product.category}
        </p>

        <h3 className="font-display text-lg md:text-xl font-bold tracking-tight leading-snug">
          {product.name}
        </h3>

        <p className={`text-xs md:text-sm mt-1.5 leading-relaxed ${dark ? 'text-white/60' : 'text-black/60'}`}>
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-2 mt-6 pt-4 border-t border-current/10">
          {/* LOOPING STRIKE-THROUGH + POPPING CURRENT PRICE */}
          <div className="flex flex-col">
            {product.original_price && (
              <span className="font-display relative inline-block w-fit text-xs md:text-sm font-semibold opacity-55 mb-0.5">
                {product.original_price}
                <motion.span
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    times: [0, 0.35, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: 'easeInOut',
                  }}
                  className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-red-500 -rotate-6 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                />
              </span>
            )}

            <motion.span
              animate={{ scale: [1, 1.09, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`font-display inline-block origin-left text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
                dark
                  ? 'from-[#FFAA33] via-[#FFD27A] to-[#F07818]'
                  : 'from-[#D97706] via-[#EA580C] to-[#B45309]'
              }`}
            >
              {product.price || 'Price coming soon'}
            </motion.span>
          </div>

          {product.url ? (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs md:text-sm font-bold shrink-0 transition ${
                dark
                  ? 'bg-[#FFAA33]/15 text-[#FFAA33] hover:bg-[#FFAA33] hover:text-white'
                  : 'bg-[#FFAA33]/20 text-orange-800 hover:bg-[#FFAA33] hover:text-white'
              }`}
            >
              View <ArrowUpRight size={15} />
            </a>
          ) : (
            <span className="text-xs opacity-50">Coming soon</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard