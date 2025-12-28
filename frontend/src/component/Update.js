import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { auth } from "../firebase";

const Update = () => {
  // ✅ ALL HOOKS FIRST (NO CONDITIONS)
  const [Title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ FETCH BOOK
  useEffect(() => {
    axios.get(`http://localhost:5000/books/${id}`).then((res) => {
      setTitle(res.data.Title);
      setAuthor(res.data.author);
      setPrice(res.data.price);
      setDescription(res.data.description);
    });
  }, [id]);

  // 🔐 ADMIN GUARD (AFTER HOOKS)
  if (auth.currentUser?.email !== "admin@bookstore.com") {
    return <Navigate to="/books" replace />;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("description", description);
    if (file) formData.append("cover", file);

    await axios.put(`http://localhost:5000/books/update/${id}`, formData);
    navigate("/books");
  };

  return (
    <div className="container">
      <h2>Update Book</h2>

      <input value={Title} onChange={(e) => setTitle(e.target.value)} />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpdate}>Update</button>
      <Link to="/books">Cancel</Link>
    </div>
  );
};

export default Update;
