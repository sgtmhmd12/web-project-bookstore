import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const Books = ({ addToCart }) => {
  const [books, setBooks] = useState([]);

  const isAdmin = auth.currentUser?.email === "admin@bookstore.com";

  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/books/delete/${id}`);
    setBooks(prev => prev.filter(b => b.ID !== id));
  };

  return (
    <div>
      <h2>Books</h2>

      {/* ADMIN ONLY */}
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
          {books.map(book => (
            <tr key={book.ID}>
              <td>
                {book.cover && (
                  <img
                    src={`data:image/png;base64,${book.cover}`}
                    width="80"
                    alt=""
                  />
                )}
              </td>

              <td>{book.Title}</td>
              <td>{book.author}</td>
              <td>${book.price}</td>

              <td className="d-flex gap-2">
                {/* EVERYONE */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </button>

                {/* ADMIN ONLY */}
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
