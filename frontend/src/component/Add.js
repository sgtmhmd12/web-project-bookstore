import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

const Add = () => {
  const [book, setBook] = useState({
    Title: "",
    author: "",
    price: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError("");

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
      console.error(err.response?.data || err.message);
      setError("Failed to add book");
    }
  };

  return (
    <div>
      <h1>Add Book</h1>

      <input name="Title" placeholder="Title" onChange={handleChange} />
      <input name="author" placeholder="Author" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input type="file" onChange={handleFile} />

      <button onClick={handleClick}>Add</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Link to="/books">See all books</Link>
    </div>
  );
};

export default Add;