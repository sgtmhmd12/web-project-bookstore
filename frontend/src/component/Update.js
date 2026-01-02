import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";

const API_URL = "https://web-project-bookstore-production.up.railway.app"; // change later to Railway

const Update = () => {
  const [Title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch book
  useEffect(() => {
    axios.get(`${API_URL}/books/${id}`).then((res) => {
      setTitle(res.data.Title);
      setAuthor(res.data.author);
      setPrice(res.data.price);
      setDescription(res.data.description);
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in");
      return;
    }

    // 🔐 Firebase ID token (NORMAL Firebase usage)
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("description", description);
    if (file) formData.append("cover", file);

    await axios.put(`${API_URL}/books/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
