import React, { useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "../context/CartProvider";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, Loader2, Heart, Star, Eye } from "lucide-react";

function Card({ item }) {
  const { addToCart, buyNow, isLoading, error } = useCart();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null); // 'cart' or 'buy'
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    setActionLoading("cart");
    const success = await addToCart(item);
    setActionLoading(null);

    if (success) {
      console.log("Item added to cart successfully!");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // Prevent card click
    setActionLoading("buy");
    const success = await buyNow(item);
    setActionLoading(null);

    if (success) {
      navigate("/checkout");
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={
            item.image ||
            item.imageUrl ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={item.title || item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md z-10">
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Badge/Tag */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {item.category}
          </div>
        )}

        {/* Overlay with quick actions (visible on hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/20"
              onClick={handleAddToCart}
              disabled={actionLoading === "cart"}>
              {actionLoading === "cart" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBuyNow}
              disabled={actionLoading === "buy"}>
              {actionLoading === "buy" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${item._id}`);
              }}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(item.rating || 4.5)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({item.rating || 4.5}) • {item.reviews || 128} reviews
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {item.title || item.name || "No Title"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description || "No description available"}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${item.price || 0}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">
                ${item.originalPrice}
              </span>
            )}
          </div>
          {item.originalPrice && item.originalPrice > item.price && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Save ${(item.originalPrice - item.price).toFixed(2)}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {(() => {
            const stock = item.stock || item.quantity || 0;

            if (stock === 0) {
              return (
                <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Out of Stock
                </span>
              );
            } else if (stock <= 5) {
              return (
                <span className="text-orange-600 text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Low Stock - Only {stock} left!
                </span>
              );
            } else if (stock <= 20) {
              return (
                <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  In Stock ({stock} available)
                </span>
              );
            } else {
              return (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  In Stock ({stock > 50 ? "50+" : stock} available)
                </span>
              );
            }
          })()}
        </div>

        {/* Quantity Badge */}
        {(() => {
          const stock = item.stock || item.quantity || 0;
          if (stock > 0 && stock <= 10) {
            return (
              <div className="mb-3">
                <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  {stock <= 3 ? "Almost gone!" : "Limited quantity"}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={
              isLoading ||
              actionLoading === "cart" ||
              (item.stock || item.quantity || 0) === 0
            }
            variant="outline"
            className="flex-1 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2">
            {actionLoading === "cart" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            Add to Cart
          </Button>

          <Button
            onClick={handleBuyNow}
            disabled={
              isLoading ||
              actionLoading === "buy" ||
              (item.stock || item.quantity || 0) === 0
            }
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            {actionLoading === "buy" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;
