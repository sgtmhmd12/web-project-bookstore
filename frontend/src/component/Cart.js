import React from "react";

function Cart({ cart, removeFromCart }) {
  if (cart.length === 0) {
    return <h3>Your cart is empty</h3>;
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.ID}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h5>{item.Title}</h5>
          <p>${Number(item.price)}</p>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeFromCart(item.ID)}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />
      <h4>Total: ${total}</h4>
    </div>
  );
}

export default Cart;
