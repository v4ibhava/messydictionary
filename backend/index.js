import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Connect to MongoDB
await mongoose.connect("mongodb://127.0.0.1:27017/dictionary");

// 📘 Schema & Model
const wordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  meaning: { type: String, required: true },
  language: { type: String, default: "English" },
  addedBy: { type: String, default: "anonymous" },
});

const Word = mongoose.model("Word", wordSchema);

// ➕ Add a new word
app.post("/add", async (req, res) => {
  try {
    const { word, meaning, language } = req.body;
    const newWord = new Word({ word, meaning, language });
    await newWord.save();
    res.json({ message: "Word added!", word: newWord });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔍 Get a word definition
app.get("/define/:word", async (req, res) => {
  const word = await Word.findOne({ word: req.params.word });
  word ? res.json(word) : res.status(404).json({ error: "Word not found" });
});

// 💡 Suggest similar words
app.get("/suggest", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  const words = await Word.find(
    { word: { $regex: `^${q}`, $options: "i" } },
    "word"
  ).limit(5);
  res.json(words.map((w) => w.word));
});

// 🚀 Run server
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
