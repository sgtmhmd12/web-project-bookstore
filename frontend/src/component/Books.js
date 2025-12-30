import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const API_URL = "https://web-project-bookstore-production.up.railway.app";

const Books = ({ addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = auth.currentUser?.email === "admin@bookstore.com";

  /* ======================
     FETCH BOOKS
  ====================== */
  useEffect(() => {
    axios
      .get(`${API_URL}/books`)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setLoading(false);
      });
  }, []);

  /* ======================
     DELETE BOOK
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_URL}/books/delete/${id}`);
      setBooks((prev) => prev.filter((b) => b.ID !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete book");
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
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📚 Books</h2>

        {isAdmin && (
          <Link className="btn btn-success" to="/books/add">
            + Add Book
          </Link>
        )}
      </div>

      {/* BOOK GRID */}
      <div className="row g-4">
        {books.map((book) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={book.ID}>
            <div className="card h-100 shadow-sm border-0 book-card">
              
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
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.Title}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="text-muted">No Image</span>
                )}
              </div>

              {/* BODY */}
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold mb-1">{book.Title}</h6>
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
                        className="btn btn-warning btn-sm w-100"
                        to={`/books/update/${book.ID}`}
                      >
                        Update
                      </Link>

                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDelete(book.ID)}
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
