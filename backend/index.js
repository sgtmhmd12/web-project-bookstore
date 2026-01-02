console.log("🔥 INDEX.JS IS RUNNING");

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
   MYSQL CONNECTION
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
    if (err) {
      console.error("SELECT ERROR:", err);
      return res.status(500).json(err);
    }

    const books = data.map((b) => ({
      id: b.ID, // ✅ normalize ID → id
      Title: b.Title,
      author: b.author,
      price: b.price,
      description: b.description,
      cover: b.cover
        ? `https://web-project-bookstore-production.up.railway.app/images/${b.cover}`
        : null,
    }));

    res.json(books);
  });
});

/* ======================
   GET BOOK BY ID
====================== */
app.get("/books/:id", (req, res) => {
  db.query(
    "SELECT * FROM books WHERE ID = ?",
    [req.params.id],
    (err, data) => {
      if (err || data.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      const b = data[0];
      res.json({
        id: b.ID, // ✅ normalize
        Title: b.Title,
        author: b.author,
        price: b.price,
        description: b.description,
        cover: b.cover
          ? `https://web-project-bookstore-production.up.railway.app/images/${b.cover}`
          : null,
      });
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
      if (err) {
        console.error("INSERT ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* ======================
   UPDATE BOOK
====================== */
app.post("/books/update/:id", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const { id } = req.params;

  let sql, values;

  if (req.file) {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?, cover=?
      WHERE ID=?
    `;
    values = [Title, author, price, description, req.file.filename, id];
  } else {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?
      WHERE ID=?
    `;
    values = [Title, author, price, description, id];
  }

  db.query(sql, values, (err) => {
    if (err) {
      console.error("UPDATE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ success: true });
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  db.query("DELETE FROM books WHERE ID = ?", [req.params.id], (err) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json(err);
    }
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
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});
