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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ======================
     HANDLERS
  ====================== */
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card shadow border-0">
            <div className="card-body">
              <h3 className="fw-bold mb-4">📘 Add New Book</h3>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* TITLE */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="Title"
                    className="form-control"
                    placeholder="Enter book title"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* AUTHOR */}
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    placeholder="Enter author name"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PRICE */}
                <div className="mb-3">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="form-control"
                    placeholder="Enter price"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Short description"
                    onChange={handleChange}
                  />
                </div>

                {/* COVER */}
                <div className="mb-4">
                  <label className="form-label">Book Cover</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFile}
                  />
                </div>

                {/* ACTIONS */}
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/books" className="btn btn-outline-secondary">
                    ← Back to Books
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-success px-4"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
