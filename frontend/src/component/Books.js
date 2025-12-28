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
    try {
      await axios.delete(`${API_URL}/books/delete/${id}`);
      setBooks((prev) => prev.filter((b) => b.ID !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ======================
     UI STATES
  ====================== */
  if (loading) {
    return <p>Loading books...</p>;
  }

  if (books.length === 0) {
    return <p>No books found.</p>;
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <div>
      <h2>Books</h2>

      {isAdmin && (
        <Link className="btn btn-success mb-3" to="/books/add">
          + Add Book
        </Link>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.ID}>
              <td>
                {book.cover ? (
                  <img
                    src={book.cover}
                    width="80"
                    alt={book.Title}
                  />
                ) : (
                  "No image"
                )}
              </td>

              <td>{book.Title}</td>
              <td>{book.author}</td>
              <td>${book.price}</td>

              <td className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </button>

                {isAdmin && (
                  <>
                    <Link
                      className="btn btn-warning btn-sm"
                      to={`/books/update/${book.ID}`}
                    >
                      Update
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.ID)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;