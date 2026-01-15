import { useState, useEffect } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchPage() {
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Fetch suggestions (safe + debounced)
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      //  when input is empty → clear everything
      if (!word.trim()) {
        setSuggestions([]);
        setResult(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/suggest?q=${encodeURIComponent(word)}`,
          { signal: controller.signal }
        );

        const list = res.data?.suggestions || res.data || [];
        setSuggestions(Array.isArray(list) ? list : []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Suggestion error:", err);
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [word]);

  //  Search definition (reusable)
  const searchWord = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSuggestions([]);
    searchWord(word);
  };

  //  Floating + Draggable Motion
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  onDragEnd={(_, info) => {
  if (info.offset.y > 100) {
    navigate("/add");
  } else {
    animate(y, 0, {
      type: "spring",
      stiffness: 180,
      damping: 18,
    });
  }
}}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/*  Title */}
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

      {/*  Search */}
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
          onBlur={() => {
            //  mobile-friendly: hide suggestions on blur
            setTimeout(() => setSuggestions([]), 150);
          }}
        />

        {/*  autosuggestion click triggers search */}
        {Array.isArray(suggestions) && suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 w-full z-10">
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                className="px-5 py-2 cursor-pointer hover:text-[#D1855C]"
                onClick={() => {
                  setWord(s);
                  setSuggestions([]);
                  searchWord(s); //  acts as search hit
                }}
              >
                {s}
              </motion.li>
            ))}
          </ul>
        )}
      </form>

      {/*  Result */}
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
