import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   IMAGES FOLDER
====================== */
const IMAGE_DIR = "images";
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}
app.use("/images", express.static(IMAGE_DIR));

/* ======================
   MULTER CONFIG
====================== */
const storage = multer.diskStorage({
  destination: IMAGE_DIR,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ======================
   MYSQL CONNECTION POOL (RAILWAY SAFE)
====================== */
const db = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "KvxJwhfgdUaxvKKDeKWRQvipFqsHHsHD",
  database: "railway",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* Optional: pool health check */
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ DB pool error:", err);
  } else {
    console.log("✅ DB pool ready");
  }
});

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ======================
   GET ALL BOOKS (WITH FULL IMAGE URL)
====================== */
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) {
      console.error("❌ SELECT ERROR:", err);
      return res.status(500).json(err);
    }

    const books = data.map((b) => ({
      ...b,
      cover: b.cover
        ? `https://web-project-bookstore-production.up.railway.app/images/${b.cover}`
        : null,
    }));

    res.json(books);
  });
});

/* ======================
   ADD BOOK
====================== */
app.post("/books/create", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  const sql =
    "INSERT INTO books (Title, author, price, description, cover) VALUES (?,?,?,?,?)";

  db.query(sql, [Title, author, price, description, cover], (err, result) => {
    if (err) {
      console.error("❌ INSERT ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({ success: true, id: result.insertId });
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.error("❌ DELETE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ success: true });
  });
});

/* ======================
   START SERVER (RAILWAY REQUIRED)
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
