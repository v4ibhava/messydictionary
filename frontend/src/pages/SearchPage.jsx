import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchPage() {
  const navigate = useNavigate();
  const { word: routeWord } = useParams();

  const [word, setWord] = useState(routeWord || "");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const listRef = useRef([]);

  /* -------------------- Autosuggest (debounced + abort) -------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      if (!word.trim()) {
        setSuggestions([]);
        setResult(null);
        setActiveIndex(-1);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/suggest?q=${encodeURIComponent(word)}`,
          { signal: controller.signal }
        );

        setSuggestions(Array.isArray(res.data) ? res.data : []);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [word]);

  /* -------------------- SEO: load word from URL -------------------- */
  useEffect(() => {
    if (routeWord) {
      searchWord(routeWord, false);
    }
  }, [routeWord]);

  /* -------------------- Search Logic -------------------- */
  const searchWord = async (searchTerm, pushRoute = true) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      if (pushRoute) {
        navigate(`/word/${encodeURIComponent(searchTerm.toLowerCase())}`);
      }

      const res = await axios.get(
        `${API_URL}/define/${encodeURIComponent(searchTerm)}`
      );

      setResult(res.data);
    } catch (err) {
      setResult({
        error: err?.response?.data?.error || "Word not found",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Keyboard Navigation -------------------- */
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        i <= 0 ? suggestions.length - 1 : i - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      setWord(selected);
      setSuggestions([]);
      searchWord(selected);
    }

    if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  /* -------------------- Motion (UNCHANGED) -------------------- */
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Title (UNCHANGED) */}
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

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSuggestions([]);
          searchWord(word);
        }}
        className="relative w-full max-w-lg rounded-full px-5 py-4"
      >
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a word..."
          className="w-full bg-transparent text-lg outline-none"
          onBlur={() => setTimeout(() => setSuggestions([]), 150)}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 w-full z-10">
            {suggestions.map((s, i) => (
              <motion.li
                key={s}
                ref={(el) => (listRef.current[i] = el)}
                className={`px-5 py-2 cursor-pointer ${
                  i === activeIndex
                    ? "text-[#D1855C]"
                    : "hover:text-[#D1855C]"
                }`}
                onMouseDown={() => {
                  setWord(s);
                  setSuggestions([]);
                  searchWord(s);
                }}
              >
                {s}
              </motion.li>
            ))}
          </ul>
        )}
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-10 max-w-lg w-full p-6 rounded-2xl animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
        </div>
      )}

      {/* Result */}
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
