import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const WORDS = [
  'ANIMATION',
  'CREATIVITY',
  'TECHNOLOGY',
  
]

export default function TypingHeroWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = WORDS[wordIndex]

    let timer
    if (!isDeleting && text === currentWord) {
      // Pause when full word is typed
      timer = setTimeout(() => setIsDeleting(true), 1500)
    } else if (isDeleting && text === '') {
      // Move to next word when erased
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % WORDS.length)
    } else {
      // Type or erase one letter
      timer = setTimeout(
        () => {
          setText((prev) =>
            isDeleting
              ? currentWord.slice(0, prev.length - 1)
              : currentWord.slice(0, prev.length + 1)
          )
        },
        isDeleting ? 45 : 85
      )
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  return (
    <span className="inline-flex items-center flex-wrap">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA33] via-[#FFD27A] to-[#F07818]">
        {text || '\u00A0'}
      </span>

      {/* Blinking cursor */}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[4px] md:w-[6px] h-[0.85em] bg-[#FFAA33] ml-1 rounded-full"
      />

      {/* Twinkling Sparkle */}
      <motion.span
        animate={{
          scale: [0.85, 1.25, 0.85],
          rotate: [0, 15, -10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex ml-2 -mt-6 md:-mt-12 text-[#FFD27A]"
      >
        <Sparkles className="w-6 h-6 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(255,170,51,0.8)]" />
      </motion.span>
    </span>
  )
}