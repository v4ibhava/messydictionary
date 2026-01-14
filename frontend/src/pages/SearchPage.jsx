import { useState, useEffect } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ✅ API base URL from env
const API_URL = import.meta.env.VITE_API_URL;

export default function SearchPage() {
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // ✅
  const navigate = useNavigate();

  // 🔍 Fetch suggestions (debounced + safe)
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      if (!word.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/suggest?q=${encodeURIComponent(word)}`,
          { signal: controller.signal }
        );
        setSuggestions(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Suggestion error:", err);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [word]);

  // 🔎 Search definition
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/define/${encodeURIComponent(word)}`
      );
      setResult(res.data);
      setSuggestions([]);
    } catch (err) {
      setResult({
        error: err?.response?.data?.error || "Word not found",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✨ Floating + Draggable Motion
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  useEffect(() => {
    const controls = animate(y, [0, -8, 8, 0], {
      repeat: Infinity,
      duration: 6,
    });
    return controls.stop;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* 🧠 Title */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-10 text-center select-none">
        <motion.span
          style={{ y, rotate }}
          drag="y"
          dragElastic={0.4}
          dragConstraints={{ top: 0, bottom: 150 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) {
              navigate("/add");
            } else {
              animate(y, 0, { type: "spring", stiffness: 150, damping: 12 });
            }
          }}
          className="inline-block text-[#D1855C] cursor-grab"
        >
          MY
        </motion.span>{" "}
        Dictionary
      </h1>

      {/* 🔍 Search */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-lg rounded-full px-5 py-4"
      >
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word..."
          className="w-full bg-transparent text-lg outline-none"
        />

        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 w-full z-10">
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                className="px-5 py-2 cursor-pointer hover:text-[#D1855C]"
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
      {loading && <p className="mt-6 text-gray-400">Searching...</p>}

      {result && !loading && (
        <motion.div className="mt-10 max-w-lg w-full p-6 rounded-2xl text-center">
          {result.error ? (
            <p className="text-red-400">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#D1855C] mb-2">
                {result.word}
              </h2>
              <p className="text-gray-200">{result.meaning}</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
