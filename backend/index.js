import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(compression());

// ---------- MongoDB Connection (Render-safe) ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ---------- Schema & Model ----------
const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  meaning: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: "unknown"
  },
  addedBy: {
    type: String,
    default: "anonymous"
  }
});

const Word = mongoose.model("Word", wordSchema);

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.send("API running");
});

// ---------- Add Word ----------
app.post("/add", async (req, res) => {
  try {
    const { word, meaning, language } = req.body;

    if (!word || !meaning) {
      return res.status(400).json({ error: "Word and meaning required" });
    }

    const exists = await Word.findOne({ word: word.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: "Word already exists" });
    }

    const newWord = new Word({ word, meaning, language });
    await newWord.save();

    res.json({ message: "Word added!", word: newWord });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Update Word ----------
app.put("/update/:word", async (req, res) => {
  try {
    const updated = await Word.findOneAndUpdate(
      { word: req.params.word.toLowerCase() },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json({ message: "Word updated", word: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Delete Word ----------
app.delete("/delete/:word", async (req, res) => {
  const deleted = await Word.findOneAndDelete({
    word: req.params.word.toLowerCase()
  });

  deleted
    ? res.json({ message: "Word deleted" })
    : res.status(404).json({ error: "Word not found" });
});

// ---------- Get Definition ----------
app.get("/define/:word", async (req, res) => {
  const word = await Word.findOne({
    word: req.params.word.toLowerCase()
  });

  word
    ? res.json(word)
    : res.status(404).json({ error: "Word not found" });
});

// ---------- Auto Suggest (Smooth & Fast) ----------
app.get("/suggest", async (req, res) => {
  const q = req.query.q?.trim().toLowerCase();

  // avoid useless queries
  if (!q || q.length < 2) return res.json([]);

  const words = await Word.find(
    { word: { $regex: `^${q}` } },
    "word"
  )
    .limit(5)
    .lean();

  res.json(words.map(w => w.word));
});

// ---------- Run Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
