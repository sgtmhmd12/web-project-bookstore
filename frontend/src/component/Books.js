import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

/* ✅ API URL WITH /api */
const API_URL =
  "https://web-project-bookstore-production.up.railway.app/api";

const Books = ({ addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /* ======================
     CHECK ADMIN (UI ONLY)
  ====================== */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.email === "admin@bookstore.com");
    });
    return () => unsubscribe();
  }, []);

  /* ======================
     FETCH BOOKS
  ====================== */
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);
        setBooks(res.data); // ✅ backend already normalized
      } catch (err) {
        console.error("FETCH BOOKS ERROR:", err);
        alert("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  /* ======================
     DELETE BOOK
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_URL}/books/delete/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  /* ======================
     UI STATES
  ====================== */
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">Loading books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">No books found.</p>
      </div>
    );
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📚 Books</h2>

        {isAdmin && (
          <Link to="/books/add" className="btn btn-success">
            + Add Book
          </Link>
        )}
      </div>

      <div className="row g-4">
        {books.map((book) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={book.id}>
            <div className="card h-100 shadow-sm border-0">
              {/* COVER */}
              <div
                style={{
                  height: "220px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={book.cover || "/book-placeholder.png"}
                  alt={book.title}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "/book-placeholder.png";
                  }}
                />
              </div>

              {/* BODY */}
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold mb-1">{book.title}</h6>
                <small className="text-muted">{book.author}</small>

                <p className="fw-bold text-success mt-2 mb-3">
                  ${Number(book.price).toFixed(2)}
                </p>

                <div className="mt-auto d-grid gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => addToCart(book)}
                  >
                    Add to Cart
                  </button>

                  {isAdmin && (
                    <div className="d-flex gap-2">
                      <Link
                        to={`/books/update/${book.id}`}
                        className="btn btn-warning btn-sm w-100"
                      >
                        Update
                      </Link>

                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
