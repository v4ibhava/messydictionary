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
  initial={{ opacity: 12 }}
  animate={{ opacity: 1, y: [0, 10, 0] }}
  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
  className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
>
  <div className="flex flex-col items-center gap-2">
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_14px_rgba(255,255,255,0.35)]"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>

  </div>
</motion.a>
  )
}

export default ScrollDownIndicator;