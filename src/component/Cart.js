function Cart({ cart, removeFromCart }) {
  return (
    <div className="text-light">
      <h1 className="text-info mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="alert alert-secondary">Your cart is empty.</div>
      ) : (
        <ul className="list-group">
          {cart.map((b, i) => (
            <li
              key={i}
              className="list-group-item bg-dark text-light border-info d-flex justify-content-between align-items-center"
            >
              <span>
                {b.title} — <span className="text-warning">${b.price}</span>
              </span>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(b.title)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
