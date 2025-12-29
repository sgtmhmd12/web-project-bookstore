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
   MULTER
====================== */
const storage = multer.diskStorage({
  destination: IMAGE_DIR,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ======================
   MYSQL CONNECTION (RAILWAY INTERNAL)
   ⚠️ DO NOT RUN LOCALLY
====================== */
const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "KvxJwhfgdUaxvKKDeKWRQvipFqsHHsHD",
  database: "railway",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1); // IMPORTANT: crash so Railway shows error
  } else {
    console.log("✅ Connected to MySQL");
  }
});

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ======================
   GET ALL BOOKS
====================== */
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) {
      console.error("❌ SELECT ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(data);
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
