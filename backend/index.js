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
   MYSQL CONNECTION
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
app.get("/api/books", (req, res) => {
  db.query("SELECT * FROM books", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(
      rows.map((b) => ({
        id: b.ID,
        title: b.Title,
        author: b.author,
        price: b.price,
        description: b.description,
        cover: b.cover
          ? `${req.protocol}://${req.get("host")}/images/${b.cover}`
          : null,
      }))
    );
  });
});

/* ======================
   GET BOOK BY ID
====================== */
app.get("/api/books/:id", (req, res) => {
  db.query(
    "SELECT * FROM books WHERE ID = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (rows.length === 0)
        return res.status(404).json({ message: "Book not found" });

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
    }
  );
});

/* ======================
   ADD BOOK
====================== */
app.post("/api/books/create", upload.single("cover"), (req, res) => {
  const { title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO books (Title, author, price, description, cover) VALUES (?, ?, ?, ?, ?)",
    [title, author, price, description, cover],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* ======================
   UPDATE BOOK
====================== */
app.post("/api/books/update/:id", upload.single("cover"), (req, res) => {
  const { title, author, price, description } = req.body;
  const { id } = req.params;

  let sql =
    "UPDATE books SET Title=?, author=?, price=?, description=?";
  let values = [title, author, price, description];

  if (req.file) {
    sql += ", cover=?";
    values.push(req.file.filename);
  }

  sql += " WHERE ID=?";
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ success: true });
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/api/books/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM books WHERE ID = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Delete failed" });
      res.json({ success: true });
    }
  );
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
