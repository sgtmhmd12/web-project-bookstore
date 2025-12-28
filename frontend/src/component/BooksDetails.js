import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function BookDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD BOOK FROM BACKEND
  // ======================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading book:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h3>Loading book...</h3>;
  }

  if (!book) {
    return <h3>Book not found</h3>;
  }

  // ======================
  // ADD TO CART
  // ======================
  const handleAddToCart = () => {
    addToCart(book);
    navigate("/cart");
  };

  // ======================
  return (
    <div className="row">
      <div className="col-md-5">
        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt={book.Title}
            className="img-fluid rounded shadow"
          />
        )}
      </div>

      <div className="col-md-7">
        <h2>{book.Title}</h2>
        <h5 className="text-muted">{book.author}</h5>

        <p className="mt-3">{book.description}</p>

        <h4 className="text-success">${book.price}</h4>

        <button
          className="btn btn-primary mt-3"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <button
          className="btn btn-secondary mt-3 ms-3"
          onClick={() => navigate("/books")}
        >
          Back to Books
        </button>
      </div>
    </div>
  );
}

export default BookDetails;
