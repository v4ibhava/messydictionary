import { useState, useEffect } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  // 🔍 Fetch suggestions
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (word.trim()) {
        const res = await axios.get(`http://localhost:3000/suggest?q=${word}`);
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [word]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    const res = await axios.get(`http://localhost:3000/define/${word}`);
    setResult(res.data);
    setSuggestions([]);
  };

  // ✨ Floating + Draggable Motion Setup
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  useEffect(() => {
    const controls = animate(y, [0, -8, 8, 0], {
    });
    return controls.stop;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] text-white p-4 relative overflow-hidden">
      {/* Subtle glossy overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

      {/* 🧠 Title with draggable “MY” */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-10 text-center select-none">
        <motion.span
          style={{ y, rotate }}
          drag="y"
          dragElastic={0.4}
          dragConstraints={{ top: 0, bottom: 150 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) {
              navigate("/add"); // 👈 navigate to Add page
            } else {
              animate(y, 0, { type: "spring", stiffness: 150, damping: 12 });
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block text-[#D1855C] cursor-grab active:cursor-grabbing select-none"
        >
          MY
        </motion.span>{" "}
        <span className="text-white">Dictionary</span>
      </h1>

      {/* 🔍 Search box */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-lg backdrop-blur-md bg-[rgba(255,255,255,0.05)] border border-[#D1855C]/40 rounded-full shadow-[0_0_25px_rgba(209,133,92,0.25)] px-5 py-4"
      >
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word..."
          className="w-full bg-transparent text-lg text-white placeholder-gray-400 outline-none"
        />

        {/* ✨ Transparent Floating Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 w-full z-10 space-y-1">
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-2 cursor-pointer text-white hover:text-[#D1855C] transition-all"
                onClick={() => {
                  setWord(s);
                  setSuggestions([]);
                }}
              >
                {s}
              </motion.li>
            ))}
          </ul>
        )}
      </form>

      {/* 📘 Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-lg w-full backdrop-blur-md bg-[rgba(255,255,255,0.05)] border border-[#D1855C]/40 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(209,133,92,0.25)]"
        >
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#D1855C] mb-2 drop-shadow-[0_0_10px_#D1855C]">
                {result.word}
              </h2>
              <p className="text-gray-200 leading-relaxed">{result.meaning}</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
