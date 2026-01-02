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
   MYSQL CONNECTION POOL
====================== */
const db = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "KvxJwhfgdUaxvKKDeKWRQvipFqsHHsHD",
  database: "railway",
  port: 3306,
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
    if (err) return res.status(500).json(err);

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
   GET BOOK BY ID  ✅ FIX 1
====================== */
app.get("/books/:id", (req, res) => {
  db.query(
    "SELECT * FROM books WHERE id=?",
    [req.params.id],
    (err, data) => {
      if (err || data.length === 0)
        return res.status(404).json({ message: "Book not found" });

      res.json(data[0]);
    }
  );
});

/* ======================
   ADD BOOK
====================== */
app.post("/books/create", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO books (Title, author, price, description, cover) VALUES (?,?,?,?,?)",
    [Title, author, price, description, cover],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* ======================
   UPDATE BOOK  ✅ FIX 2
====================== */
app.put("/books/update/:id", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const { id } = req.params;

  let sql, values;

  if (req.file) {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?, cover=?
      WHERE id=?
    `;
    values = [Title, author, price, description, req.file.filename, id];
  } else {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?
      WHERE id=?
    `;
    values = [Title, author, price, description, id];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
