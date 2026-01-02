console.log("🔥 INDEX.JS IS RUNNING");

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

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

app.use("/images", express.static(path.resolve(IMAGE_DIR)));

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
   MYSQL CONNECTION (RAILWAY)
====================== */
const db = mysql.createPool({
  host: process.env.MYSQLHOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "YOUR_PASSWORD",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 3306,
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
  db.query("SELECT * FROM books", (err, rows) => {
    if (err) {
      console.error("SELECT ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const books = rows.map((b) => ({
      id: b.ID,
      title: b.Title,
      author: b.author,
      price: b.price,
      description: b.description,
      cover: b.cover
        ? `${req.protocol}://${req.get("host")}/images/${b.cover}`
        : null,
    }));

    res.json(books);
  });
});

/* ======================
   GET BOOK BY ID
====================== */
app.get("/books/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM books WHERE ID = ?", [id], (err, rows) => {
    if (err) {
      console.error("SELECT BY ID ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const b = rows[0];

    res.json({
      id: b.ID,
      title: b.Title,
      author: b.author,
      price: b.price,
      description: b.description,
      cover: b.cover
        ? `${req.protocol}://${req.get("host")}/images/${b.cover}`
        : null,
    });
  });
});

/* ======================
   ADD BOOK
====================== */
app.post("/books/create", upload.single("cover"), (req, res) => {
  const { title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  if (!title || !author || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO books (Title, author, price, description, cover) VALUES (?, ?, ?, ?, ?)",
    [title, author, price, description, cover],
    (err, result) => {
      if (err) {
        console.error("INSERT ERROR:", err);
        return res.status(500).json({ error: "Insert failed" });
      }

      res.json({
        success: true,
        id: result.insertId,
      });
    }
  );
});

/* ======================
   UPDATE BOOK
====================== */
app.post("/books/update/:id", upload.single("cover"), (req, res) => {
  const { id } = req.params;
  const { title, author, price, description } = req.body;

  let sql;
  let values;

  if (req.file) {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?, cover=?
      WHERE ID=?
    `;
    values = [title, author, price, description, req.file.filename, id];
  } else {
    sql = `
      UPDATE books
      SET Title=?, author=?, price=?, description=?
      WHERE ID=?
    `;
    values = [title, author, price, description, id];
  }

  db.query(sql, values, (err) => {
    if (err) {
      console.error("UPDATE ERROR:", err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ success: true });
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM books WHERE ID = ?", [id], (err) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: "Delete failed" });
    }

    res.json({ success: true });
  });
});

/* ======================
   404 HANDLER (LAST)
====================== */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* ======================
   START SERVER (RAILWAY)
====================== */
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
