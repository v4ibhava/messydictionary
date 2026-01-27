import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import ShaderBackground from "../components/ShaderBackground"
import bookImg from "../assets/book.png"

const API_URL = import.meta.env.VITE_API_URL

export default function AddPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [word, setWord] = useState("")
  const [meaning, setMeaning] = useState("")
  const [language, setLanguage] = useState("English")

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 640)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 640)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!word.trim() || !meaning.trim()) return
    try {
      await axios.post(`${API_URL}/add`, { word, meaning, language })
      setWord("")
      setMeaning("")
      setLanguage("English")
      alert("✅ Word added successfully!")
    } catch (error) {
      console.error("Error adding word:", error)
    }
  }

  const handleBookToggle = () => {
    if (isOpen) {
      setIsOpen(false)
      setTimeout(() => navigate("/"), 1000)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {/* 🔮 SHADER BACKGROUND */}
      <ShaderBackground />

      {/* 📖 PAGE CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center bg-transparent text-[var(--color-text)] overflow-hidden p-4 perspective-[2000px]">
        <motion.div
          className="relative w-[88vw] max-w-[340px] h-[520px] sm:w-[500px] sm:h-[550px]"
          animate={{ x: isOpen && isDesktop ? "25%" : "0%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* RIGHT PAGE — FORM */}
          <div
            className="absolute inset-0 bg-[#fdfbf7] rounded-r-lg rounded-l-sm border-l-4 border-gray-300 flex flex-col p-6 sm:p-8 z-0"
            style={{
              boxShadow: `
                inset 20px 0 50px rgba(0,0,0,0.1),
                1px 1px 0 #e0e0e0,
                2px 2px 0 #e0e0e0,
                3px 3px 0 #e0e0e0,
                4px 4px 0 #e0e0e0,
                5px 5px 10px rgba(0,0,0,0.2)
              `,
            }}
          >
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-800 mb-4 text-center border-b-2 border-gray-800 pb-2">
              New Entry
            </h3>

            <form onSubmit={handleAdd} className="flex flex-col gap-4 h-full">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={!isOpen}
                  className="w-full bg-transparent border-b border-gray-400 text-gray-700 font-serif py-1 outline-none"
                >
                  <option>Hinglish</option>
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Marathi</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Word
                </label>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  disabled={!isOpen}
                  placeholder="Type word..."
                  className="w-full bg-transparent border-b border-gray-400 text-gray-800 text-xl font-serif py-1 outline-none"
                />
              </div>

              <div className="flex-grow flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Definition
                </label>
                <textarea
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  disabled={!isOpen}
                  placeholder="What does it mean?"
                  className="flex-grow w-full bg-transparent border-b border-gray-400 text-gray-600 font-serif italic py-1 resize-none outline-none leading-[2rem]"
                  style={{
                    backgroundImage:
                      "linear-gradient(transparent 95%, #e5e7eb 95%)",
                    backgroundSize: "100% 2rem",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!isOpen}
                className="mt-2 bg-[#D1855C] text-[#fdfbf7] py-3 rounded font-serif tracking-widest hover:bg-[#b36d49] transition-all uppercase text-xs active:scale-95"
              >
                Add to Dictionary
              </button>
            </form>
          </div>

          {/* FRONT COVER + INNER PAGE */}
          <motion.div
            className="absolute inset-0 cursor-pointer z-10"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center left",
            }}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{
              duration: 1.2,
              type: "spring",
              stiffness: 50,
              damping: 15,
            }}
            onClick={handleBookToggle}
          >
            <div
              className="absolute inset-0 rounded-r-lg rounded-l-sm flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                backgroundImage: `url(${bookImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h1 className="text-4xl text-[#D1855C] font-serif tracking-widest bg-black/40 px-6 py-4 border-4 border-[#D1855C]">
                DICTIONARY
              </h1>
            </div>

            <div
              className="absolute inset-0 bg-[#fdfbf7] rounded-l-lg rounded-r-sm flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="font-serif italic text-gray-600 text-lg text-center px-8">
                “Internet ko sikhao naya word..”
              </p>
            </div>
          </motion.div>

          {!isOpen && (
            <div className="absolute -bottom-12 w-full text-center text-gray-400 text-sm animate-pulse">
              Tap cover to open
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
