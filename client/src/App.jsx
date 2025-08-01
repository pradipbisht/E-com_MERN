import React from "react";
import CreatePage from "./pages/CreatePage";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />

          {/* Product Details */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* cart */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
