import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("Title", book.Title);
    formdata.append("author", book.author);
    formdata.append("price", book.price);
    formdata.append("description", book.description);
    formdata.append("cover", file); // MUST MATCH multer

    try {
      await axios.post("http://localhost:5000/books/create", formdata);
      navigate("/books");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form">
        <h1>Add New Book</h1>

        <input type="text" placeholder="Book Title" name="Title" onChange={handleChange} required />
        <input type="text" placeholder="Author" name="author" onChange={handleChange} required />
        <input type="number" placeholder="Price" name="price" onChange={handleChange} required />
        <textarea placeholder="Description" name="description" onChange={handleChange} />

        <input type="file" onChange={handleFile} required />

        <button onClick={handleClick}>Add</button>

        {error && <p className="text-danger mt-2">Something went wrong!</p>}

        <Link to="/books">See all Books</Link>
      </div>
    </div>
  );
};

export default Add;
