import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartProvider";
import itemApi from "../api/itemApi.js";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await itemApi.getItemById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    setActionLoading("cart");
    const success = await addToCart(product, quantity);
    setActionLoading(null);
    if (success) {
      // Show success message
    }
  };

  const handleBuyNow = async () => {
    setActionLoading("buy");
    const success = await buyNow(product, quantity);
    setActionLoading(null);
    if (success) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Mock additional images if not available
  const productImages = product.images || [product.image || product.imageUrl];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={
                    productImages[selectedImage] ||
                    "https://via.placeholder.com/500x500?text=No+Image"
                  }
                  alt={product.name || product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <img
                        src={image}
                        alt={`${product.name || product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {product.category && (
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name || product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating || 4.5} ({product.reviews || 128} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        Save $
                        {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Stock Status */}
              <div className="space-y-3">
                {(() => {
                  const stock = product.stock || product.quantity || 0;

                  if (stock === 0) {
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium text-lg">
                          Out of Stock
                        </span>
                      </div>
                    );
                  } else if (stock <= 5) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-orange-600 font-medium text-lg">
                            Low Stock - Only {stock} left!
                          </span>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-orange-800 text-sm font-medium">
                            ⚡ Hurry! This item is almost sold out. Order now to
                            secure yours.
                          </p>
                        </div>
                      </div>
                    );
                  } else if (stock <= 20) {
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600 font-medium text-lg">
                          In Stock ({stock} available)
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium text-lg">
                            In Stock ({stock > 50 ? "50+" : stock} available)
                          </span>
                        </div>
                        {stock > 50 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-800 text-sm font-medium">
                              ✅ Great availability! Ready to ship immediately.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                    disabled={quantity <= 1}>
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                    disabled={
                      quantity >= (product.stock || product.quantity || 10)
                    }>
                    +
                  </button>
                </div>
                {(() => {
                  const maxStock = product.stock || product.quantity || 10;
                  if (quantity === maxStock && maxStock <= 10) {
                    return (
                      <span className="text-orange-600 text-sm font-medium">
                        Maximum available: {maxStock}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    actionLoading === "cart" ||
                    (product.stock || product.quantity || 0) === 0
                  }
                  variant="outline"
                  className="flex-1 border-gray-300 hover:border-blue-600 hover:text-blue-600 py-3">
                  {actionLoading === "cart" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  Add to Cart
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={
                    actionLoading === "buy" ||
                    (product.stock || product.quantity || 0) === 0
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3">
                  {actionLoading === "buy" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  Buy Now
                </Button>

                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  variant="outline"
                  size="lg"
                  className="px-4">
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted ? "text-red-500 fill-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
