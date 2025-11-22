import { useState } from "react";
import { Link } from "react-router-dom";
import { books } from "../data/books";

function Books({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(books.map((b) => b.category))];

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || category === book.category)
    );
  });

  return (
    <div className="text-light">
      <h1 className="text-info mb-4">Book Collection</h1>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control bg-dark text-light border-info"
            placeholder="Search title..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select bg-dark text-light border-info"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} className="bg-dark text-light">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Cards */}
      <div className="row">
        {filteredBooks.map((book) => (
          <div className="col-md-4 mb-4" key={book.id}>
            <div className="card bg-dark text-light border border-info shadow-lg h-100">
              <div className="card-body">
                <h4 className="card-title text-info">{book.title}</h4>
                <p className="card-text">
                  <b>Author:</b> {book.author}
                </p>
                <p className="text-warning"><b>${book.price}</b></p>

                <Link to={`/books/${book.id}`} className="btn btn-info w-100 mb-2">
                  View Details
                </Link>

                <button
                  className="btn btn-warning w-100"
                  onClick={() => addToCart(book)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <p className="text-center mt-4 text-muted">No books match your search.</p>
        )}
      </div>
    </div>
  );
}

export default Books;
