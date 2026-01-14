import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import bookImg from "../assets/book.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();

  // 🧠 Add new word
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;
    try {
      await axios.post(`${API_URL}/add`, { word, meaning, language });
      setWord("");
      setMeaning("");
      setLanguage("English");
      alert("✅ Word added successfully!");
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  // 📖 Handle opening & closing
  const handleBookToggle = () => {
    if (isOpen) {
      // Book is open → closing now
      setIsOpen(false);
      // Navigate after animation starts closing
      setTimeout(() => navigate("/"), 1000);
    } else {
      // Book is closed → open it
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden p-4 relative perspective-[2000px]">
      {/* 📚 BOOK WRAPPER */}
      <motion.div
        className="relative w-[340px] sm:w-[500px] h-[550px]"
        animate={{ x: isOpen ? "25%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* RIGHT PAGE — FORM */}
        <div
          className="absolute inset-0 bg-[#fdfbf7] rounded-r-lg rounded-l-sm border-l-4 border-gray-300 shadow-[10px_10px_30px_rgba(0,0,0,0.3)] flex flex-col p-8 z-0"
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
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 text-center border-b-2 border-gray-800 pb-2">
            New Entry
          </h3>

          <form onSubmit={handleAdd} className="flex flex-col gap-4 h-full">
            {/* 🌍 Language */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={!isOpen}
                className="w-full bg-transparent border-b border-gray-400 text-gray-700 font-serif py-1 focus:border-[#D1855C] outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>French</option>
                <option>Spanish</option>
                <option>German</option>
              </select>
            </div>

            {/* 📝 Word */}
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
                className="w-full bg-transparent border-b border-gray-400 text-gray-800 text-xl font-serif py-1 focus:border-[#D1855C] outline-none placeholder:text-gray-300"
              />
            </div>

            {/* 📖 Meaning */}
            <div className="flex-grow flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Definition
              </label>
              <textarea
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                disabled={!isOpen}
                placeholder="What does it mean?"
                className="flex-grow w-full bg-transparent border-b border-gray-400 text-gray-600 font-serif italic py-1 resize-none focus:border-[#D1855C] outline-none placeholder:text-gray-300 leading-[2rem]"
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
              className="mt-2 bg-[#D1855C] text-[#fdfbf7] py-3 rounded font-serif tracking-widest hover:bg-[#b36d49] transition-all shadow-lg uppercase text-sm"
            >
              Add to Dictionary
            </button>
          </form>
        </div>

        {/* FRONT COVER + INNER LEFT PAGE */}
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
          {/* FRONT COVER */}
          <div
            className="absolute inset-0 rounded-r-lg rounded-l-sm flex items-center justify-center backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              backgroundImage: `url(${bookImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow:
                "inset 10px 0 20px rgba(0,0,0,0.5), 5px 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <div className="bg-black/40 p-6 border-4 border-[#D1855C] text-center backdrop-blur-sm rounded">
              <h1 className="text-4xl text-[#D1855C] font-serif tracking-widest">
                DICTIONARY
              </h1>
            </div>
          </div>

          {/* INNER LEFT PAGE */}
          <div
            className="absolute inset-0 bg-[#fdfbf7] rounded-l-lg rounded-r-sm border-r-4 border-gray-300 flex flex-col justify-center items-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "inset -20px 0 50px rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-center opacity-70">
              <div className="w-16 h-16 border-4 border-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">✒️</span>
              </div>
              <p className="font-serif italic text-gray-600 text-lg">
                "Words are our most inexhaustible source of magic."
              </p>
              <div className="w-12 h-1 bg-gray-300 mx-auto mt-6"></div>
            </div>
          </div>
        </motion.div>

        {/* Hint */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-12 w-full text-center text-gray-500 text-sm animate-pulse"
          >
            Tap cover to open
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
