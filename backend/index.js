import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   STATIC FILES
====================== */
app.use("/images", express.static("images"));

/* ======================
   MULTER CONFIG
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

/* ======================
   MYSQL CONNECTION (RAILWAY ONLY)
====================== */
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* CONNECT TO DB
/* ======================
   ROOT (health check)
====================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ======================
   GET ALL BOOKS
====================== */
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }

    // Convert image filename to public URL
    const books = data.map((book) => ({
      ...book,
      cover: book.cover
        ? `${req.protocol}://${req.get("host")}/images/${book.cover}`
        : null,
    }));

    res.json(books);
  });
});

/* ======================
   GET ONE BOOK
====================== */
app.get("/books/:id", (req, res) => {
  const q = "SELECT * FROM books WHERE ID = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

/* ======================
   ADD BOOK
====================== */
app.post("/books/create", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  const q =
    "INSERT INTO books (Title, author, price, description, cover) VALUES (?,?,?,?,?)";

  db.query(
    q,
    [Title, author, price, description, cover],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* ======================
   UPDATE BOOK
====================== */
app.put("/books/modify/:id", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  const q =
    "UPDATE books SET Title=?, author=?, price=?, description=?, cover=? WHERE ID=?";

  db.query(
    q,
    [Title, author, price, description, cover, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  const q = "DELETE FROM books WHERE ID=?";
  db.query(q, [req.params.id], (err) => {
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