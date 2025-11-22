import { useParams, Link } from "react-router-dom";
import { books } from "../data/books";

function BookDetails({ addToCart }) {
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));

  if (!book) return <h2 className="text-danger">Book not found</h2>;

  return (
    <div className="text-light">
      <div className="card bg-dark border-info shadow-lg p-4">
        <h2 className="text-info">{book.title}</h2>
        <p><b>Author:</b> {book.author}</p>
        <p><b>Category:</b> {book.category}</p>
        <p className="text-warning"><b>${book.price}</b></p>

        <p>{book.description}</p>

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
