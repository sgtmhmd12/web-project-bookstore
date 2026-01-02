import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SafeImage from "./SafeImage";

/* ✅ API URL (NO /api) */
const API_URL =
  "https://web-project-bookstore-production.up.railway.app/api";


function BookDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD BOOK
  ====================== */
  useEffect(() => {
    axios
      .get(`${API_URL}/books/${id}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.error("Error loading book:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h3>Loading book...</h3>;
  }

  if (!book) {
    return <h3>Book not found</h3>;
  }

  /* ======================
     ADD TO CART
  ====================== */
  const handleAddToCart = () => {
    addToCart(book);
    navigate("/cart");
  };

  return (
    <div className="row">
      {/* IMAGE */}
      <div className="col-md-5 d-flex align-items-center justify-content-center">
        <SafeImage
          src={book.cover}
          alt={book.title}
          className="img-fluid rounded shadow"
          style={{
            maxHeight: "420px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* DETAILS */}
      <div className="col-md-7">
        <h2>{book.title}</h2>
        <h5 className="text-muted">{book.author}</h5>

        <p className="mt-3">{book.description}</p>

        <h4 className="text-success">
          ${Number(book.price).toFixed(2)}
        </h4>

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
