import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function ScrollDownIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < 80)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.a
      href="#about"
      aria-label="Scroll down"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 12, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
    >
      <div className="flex flex-col items-center gap-2">
        {/* SVG ARROW */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {/* Optional text */}
        <span className="text-xs tracking-widest text-white/60 uppercase">
          Scroll
        </span>
      </div>
    </motion.a>
  )
}

export default ScrollDownIndicator;