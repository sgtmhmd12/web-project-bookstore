import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import "./App.css";
import "./Style.css";

import Navbar from "./component/Navbar";
import Home from "./component/Home";
import About from "./component/About";
import Contact from "./component/Contact";
import Features from "./component/Features";

import Books from "./component/Books";
import BookDetails from "./component/BooksDetails";
import Add from "./component/Add";
import Update from "./component/Update";
import Cart from "./component/Cart";
import Login from "./component/Login";

// 👇 separate component so we can use useLocation
function AppContent() {
  const location = useLocation();

  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => [...prev, book]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((b) => b.ID !== id));
  };

  return (
    <>
      {/* ❌ Hide Navbar on login page */}
      {location.pathname !== "/" && <Navbar />}

      <div className="container mt-4">
        <Routes>
          {/* LOGIN FIRST */}
          <Route path="/" element={<Login />} />

          {/* MAIN PAGES */}
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* BOOKS */}
          <Route
            path="/books"
            element={<Books addToCart={addToCart} />}
          />
          <Route
            path="/books/:id"
            element={<BookDetails addToCart={addToCart} />}
          />

          {/* ADMIN */}
          <Route path="/books/add" element={<Add />} />
          <Route path="/books/update/:id" element={<Update />} />

          {/* CART */}
          <Route
            path="/cart"
            element={<Cart cart={cart} removeFromCart={removeFromCart} />}
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
