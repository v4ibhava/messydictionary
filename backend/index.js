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

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ---------- Schema & Model ----------
const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
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
  },
  { timestamps: true }
);

const Word = mongoose.model("Word", wordSchema);

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.status(200).send("API running");
});

// ---------- Add Word ----------
app.post("/add", async (req, res) => {
  try {
    const { word, meaning, language } = req.body;

    if (!word || !meaning) {
      return res.status(400).json({
        error: "Word and meaning required"
      });
    }

    const exists = await Word.findOne({ word: word.toLowerCase() });
    if (exists) {
      return res.status(409).json({
        error: "Word already exists"
      });
    }

    const newWord = await Word.create({
      word,
      meaning,
      language
    });

    res.status(201).json({
      message: "Word added",
      word: newWord
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ---------- Update Word ----------
app.put("/update/:word", async (req, res) => {
  try {
    const updated = await Word.findOneAndUpdate(
      { word: req.params.word.toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Word not found"
      });
    }

    res.json({
      message: "Word updated",
      word: updated
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ---------- Delete Word ----------
app.delete("/delete/:word", async (req, res) => {
  try {
    const deleted = await Word.findOneAndDelete({
      word: req.params.word.toLowerCase()
    });

    if (!deleted) {
      return res.status(404).json({
        error: "Word not found"
      });
    }

    res.json({
      message: "Word deleted"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ---------- Get Word (Primary Route) ----------
app.get("/word/:word", async (req, res) => {
  try {
    const entry = await Word.findOne({
      word: req.params.word.toLowerCase()
    }).lean();

    if (!entry) {
      return res.status(200).json({
        found: false,
        message: "Word not found"
      });
    }

    res.json({
      found: true,
      ...entry
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ---------- HEAD handler (Stops crawler spam) ----------
app.head("/word/:word", (req, res) => {
  res.status(200).end();
});

// ---------- Legacy Support ----------
app.get("/define/:word", async (req, res) => {
  try {
    const entry = await Word.findOne({
      word: req.params.word.toLowerCase()
    });

    entry
      ? res.json(entry)
      : res.status(404).json({ error: "Word not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Auto Suggest ----------
app.get("/suggest", async (req, res) => {
  try {
    const q = req.query.q?.trim().toLowerCase();

    if (!q || q.length < 2) return res.json([]);

    const words = await Word.find(
      { word: { $regex: `^${q}` } },
      "word"
    )
      .limit(5)
      .lean();

    res.json(words.map(w => w.word));
  } catch {
    res.json([]);
  }
});

// ---------- Catch-all (SEO + AdSense Safe) ----------
app.use((req, res) => {
  res.status(200).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
