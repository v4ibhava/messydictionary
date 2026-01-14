import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import bookImg from "../assets/book.png";

// ✅ API base URL from Vercel env
const API_URL = import.meta.env.VITE_API_URL;

export default function AddPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false); // ✅
  const navigate = useNavigate();

  // 🧠 Add new word
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!word.trim() || !meaning.trim()) {
      alert("Word and meaning are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/add`, {
        word,
        meaning,
        language,
      });

      setWord("");
      setMeaning("");
      setLanguage("English");
      alert("✅ Word added successfully!");
    } catch (error) {
      console.error("Error adding word:", error);
      alert(
        error?.response?.data?.error ||
          "❌ Failed to add word. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 📖 Handle opening & closing
  const handleBookToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden p-4 relative perspective-[2000px]">
      <motion.div
        className="relative w-[340px] sm:w-[500px] h-[550px]"
        animate={{ x: isOpen ? "25%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* RIGHT PAGE — FORM */}
        <div className="absolute inset-0 bg-[#fdfbf7] rounded-r-lg rounded-l-sm border-l-4 border-gray-300 shadow-[10px_10px_30px_rgba(0,0,0,0.3)] flex flex-col p-8 z-0">
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 text-center border-b-2 border-gray-800 pb-2">
            New Entry
          </h3>

          <form onSubmit={handleAdd} className="flex flex-col gap-4 h-full">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={!isOpen || loading}
              className="w-full border-b border-gray-400 py-1"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>French</option>
              <option>Spanish</option>
              <option>German</option>
            </select>

            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              disabled={!isOpen || loading}
              placeholder="Word"
              className="border-b text-xl"
            />

            <textarea
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              disabled={!isOpen || loading}
              placeholder="Meaning"
              className="flex-grow border-b"
            />

            <button
              type="submit"
              disabled={!isOpen || loading}
              className="bg-[#D1855C] text-white py-3 rounded uppercase"
            >
              {loading ? "Adding..." : "Add to Dictionary"}
            </button>
          </form>
        </div>

        {/* FRONT COVER */}
        <motion.div
          className="absolute inset-0 cursor-pointer z-10"
          animate={{ rotateY: isOpen ? -180 : 0 }}
          transition={{ duration: 1.2 }}
          onClick={handleBookToggle}
          style={{
            backgroundImage: `url(${bookImg})`,
            backgroundSize: "cover",
          }}
        />
      </motion.div>
    </div>
  );
}
