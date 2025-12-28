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
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(false);

    const formData = new FormData();
    formData.append("Title", book.Title);
    formData.append("author", book.author);
    formData.append("price", book.price);
    formData.append("description", book.description);
    if (file) formData.append("cover", file);

    try {
      await axios.post(`${API_URL}/books/create`, formData);
      navigate("/books");
    } catch (err) {
      console.error("ADD BOOK ERROR:", err.response?.data || err.message);
      setError(true);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form">
        <h1>Add New Book</h1>

        <input
          type="text"
          name="Title"
          placeholder="Book Title"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <input type="file" onChange={handleFile} />

        <button onClick={handleClick}>Add</button>

        {error && (
          <p className="text-danger mt-2">
            Something went wrong
          </p>
        )}

        <Link to="/books">See all Books</Link>
      </div>
    </div>
  );
};

export default Add;