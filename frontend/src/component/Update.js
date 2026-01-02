import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";

const API_URL = "https://web-project-bookstore-production.up.railway.app";

const Update = () => {
  // ✅ hooks FIRST
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH BOOK
  ====================== */
  useEffect(() => {
    // ✅ guard AFTER hooks
    if (!id) {
      alert("Invalid book ID");
      navigate("/books");
      return;
    }

    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_URL}/books/${id}`);

        // 🔥 normalize backend response
        const book = {
          id: res.data.id ?? res.data.ID,
          Title: res.data.Title,
          author: res.data.author,
          price: res.data.price,
          description: res.data.description,
        };

        setTitle(book.Title);
        setAuthor(book.author);
        setPrice(book.price);
        setDescription(book.description);
      } catch (err) {
        console.error("Failed to load book:", err);
        alert("Failed to load book");
        navigate("/books");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  /* ======================
     UPDATE BOOK
  ====================== */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("author", author);
      formData.append("price", price);
      formData.append("description", description);
      if (file) formData.append("cover", file);

      await axios.post(`${API_URL}/books/update/${id}`, formData);

      navigate("/books");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  /* ======================
     UI STATES
  ====================== */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Update Book</h2>

        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <input
            style={styles.input}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
          />

          <input
            style={styles.input}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
          />

          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div style={styles.actions}>
            <button type="submit" style={styles.primary}>
              Update
            </button>

            <Link to="/books" style={styles.secondary}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ======================
   STYLES
====================== */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  primary: {
    flex: 1,
    padding: "10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  secondary: {
    flex: 1,
    padding: "10px",
    background: "#eee",
    borderRadius: "5px",
    textAlign: "center",
    textDecoration: "none",
    color: "#333",
  },
};

export default Update;
