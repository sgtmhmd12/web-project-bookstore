import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://web-project-bookstore-production.up.railway.app";

const Add = () => {
  const [book, setBook] = useState({
    Title: "",
    author: "",
    price: "",
    description: "",
    cover: "", // image URL
  });

  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/books/create`, book, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/books");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form">
        <h1>Add New Book</h1>

        <input
          type="text"
          placeholder="Book Title"
          name="Title"
          value={book.Title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Author"
          name="author"
          value={book.author}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          placeholder="Price"
          name="price"
          value={book.price}
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Description"
          name="description"
          value={book.description}
          onChange={handleChange}
        />

        {/* IMAGE URL INSTEAD OF FILE */}
        <input
          type="text"
          placeholder="Cover Image URL"
          name="cover"
          value={book.cover}
          onChange={handleChange}
        />

        <button onClick={handleClick}>Add</button>

        {error && (
          <p className="text-danger mt-2">Something went wrong!</p>
        )}

        <Link to="/books">See all Books</Link>
      </div>
    </div>
  );
};

export default Add;