import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// serve static images
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
  host: "localhost",
  user: "root",
  password: "",
  database: "books", // same DB, different table
});

/* ======================
   GET ALL BOOKS
====================== */
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    // convert image to base64 (same logic as students)
    for (const d of data) {
      const imgPath = `./images/${d.cover}`;
      if (fs.existsSync(imgPath)) {
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
  const Title = req.body.Title;
  const author = req.body.author;
  const price = req.body.price;
  const description = req.body.description;
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
  const Title = req.body.Title;
  const author = req.body.author;
  const price = req.body.price;
  const description = req.body.description;
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
app.listen(5000, () => {
  console.log("Connected to backend (BOOKS).");
});
