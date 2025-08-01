import React, { useState } from "react";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";
import { Button } from "../components/ui/button";
import orderApi from "../api/orderApi";
import {
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, totalAmount, clearCart, isLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    // Shipping Information
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",

    // Order Options
    shippingMethod: "standard",
    paymentMethod: "card",
  });

  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const shippingCost = orderData.shippingMethod === "express" ? 15.99 : 5.99;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setOrderProcessing(true);

    try {
      // Validate required fields
      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "cardNumber",
        "expiryDate",
        "cvv",
        "cardholderName",
      ];
      const missingFields = requiredFields.filter((field) => !orderData[field]);

      if (missingFields.length > 0) {
        alert(
          `Please fill in the following fields: ${missingFields.join(", ")}`
        );
        setOrderProcessing(false);
        return;
      }

      // Prepare order data
      const orderPayload = {
        shippingInfo: {
          fullName: orderData.fullName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode,
          country: orderData.country,
        },
        paymentInfo: {
          method: orderData.paymentMethod,
          cardLast4: orderData.cardNumber.slice(-4),
        },
        shippingMethod: orderData.shippingMethod,
        useCart: true, // Use items from cart
      };

      // Create order via API
      const response = await orderApi.createOrderFromCart(orderPayload);

      if (response.success) {
        setOrderId(response.data.orderNumber);
        setOrderComplete(true);
      } else {
        throw new Error(response.message || "Order creation failed");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert(error.message || "Order failed. Please try again.");
    } finally {
      setOrderProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 hover:bg-blue-700">
              View Orders
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate("/cart")}
            variant="outline"
            className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={orderData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={orderData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={orderData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={orderData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>

              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={orderData.shippingMethod === "standard"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Standard Shipping</div>
                    <div className="text-sm text-gray-600">
                      5-7 business days
                    </div>
                  </div>
                  <div className="font-medium">$5.99</div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={orderData.shippingMethod === "express"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Express Shipping</div>
                    <div className="text-sm text-gray-600">
                      2-3 business days
                    </div>
                  </div>
                  <div className="font-medium">$15.99</div>
                </label>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Payment Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={orderData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={orderData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={orderData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={orderData.cardholderName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem._id}
                    className="flex items-center space-x-3">
                    <img
                      src={
                        cartItem.itemId.image ||
                        "https://via.placeholder.com/60"
                      }
                      alt={cartItem.itemId.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        {cartItem.itemId.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {cartItem.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(cartItem.itemId.price * cartItem.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={orderProcessing}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold">
                {orderProcessing
                  ? "Processing..."
                  : `Place Order - $${finalTotal.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
