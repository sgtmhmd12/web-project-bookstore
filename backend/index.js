import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://YOUR-NETLIFY-SITE.netlify.app", // change later
    ],
  })
);

app.use(express.json());
app.use(express.static("public"));

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
      file.originalname +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

/* ======================
   MYSQL CONNECTION
====================== */
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "books",
  port: process.env.MYSQLPORT || 3306,
});

/* CONNECT TO DB */
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

/* ======================
   GET ALL BOOKS
====================== */
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }

    for (const d of data) {
      const imgPath = `./images/${d.cover}`;
      if (d.cover && fs.existsSync(imgPath)) {
        d.cover = fs.readFileSync(imgPath).toString("base64");
      } else {
        d.cover = null;
      }
    }

    return res.json(data);
  });
});

/* ======================
   GET ONE BOOK
====================== */
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM books WHERE ID = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/* ======================
   ADD BOOK
====================== */
app.post("/books/create", upload.single("cover"), (req, res) => {
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  const q =
    "INSERT INTO books (`Title`, `author`, `price`, `description`, `cover`) VALUES (?,?,?,?,?)";

  db.query(q, [Title, author, price, description, cover], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

/* ======================
   DELETE BOOK
====================== */
app.delete("/books/delete/:id", (req, res) => {
  const id = req.params.id;

  const q1 = "SELECT cover FROM books WHERE ID = ?";
  db.query(q1, [id], (err1, data1) => {
    if (!err1 && data1.length > 0 && data1[0].cover) {
      const filePath = `./images/${data1[0].cover}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  const q = "DELETE FROM books WHERE ID = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

/* ======================
   UPDATE BOOK
====================== */
app.post("/books/modify/:id", upload.single("cover"), (req, res) => {
  const id = req.params.id;
  const { Title, author, price, description } = req.body;
  const cover = req.file ? req.file.filename : null;

  const q =
    "UPDATE books SET `Title`=?, `author`=?, `price`=?, `description`=?, `cover`=? WHERE ID=?";

  db.query(
    q,
    [Title, author, price, description, cover, id],
    (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    }
  );
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
