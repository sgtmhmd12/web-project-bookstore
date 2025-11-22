import { useParams, Link } from "react-router-dom";
import { books } from "../data/books";

function BookDetails({ addToCart }) {
  const { id } = useParams();

  // Fix: ensure matching types (string vs string)
  const book = books.find((b) => b.id.toString() === id.toString());

  if (!book) return <h2 className="text-danger">Book not Found</h2>;

  return (
    <div className="container text-light mt-4">
      <div className="card bg-dark border-info shadow-lg p-4">

        {/* IMAGE */}
        <img
          src={book.cover}
          alt={book.title}
          className="img-fluid mb-3"
          style={{ maxHeight: "450px", objectFit: "cover" }}
        />

        <h2 className="text-info">{book.title}</h2>
        <p><b>Author:</b> {book.author}</p>
        <p><b>Category:</b> {book.category}</p>
        <p className="text-warning"><b>${book.price}</b></p>
        <p className="mt-3">{book.description}</p>

        <button className="btn btn-warning mt-3" onClick={() => addToCart(book)}>
          Add to Cart
        </button>

        <Link to="/books" className="btn btn-outline-info mt-3 ms-3">
          Back to Books
        </Link>
      </div>
    </div>
  );
}

export default BookDetails;
