import itemApi from "../api/itemApi.js";
import { Button } from "../components/ui/button";
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

function CreatePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discounted: "",
    quantity: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading if checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setImageFile(file);
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discounted = parseFloat(formData.discounted) || 0;
    return price - discounted;
  };

  // Validate form before submission
  const validateForm = () => {
    const price = parseFloat(formData.price) || 0;
    const discounted = parseFloat(formData.discounted) || 0;

    if (discounted > 0 && discounted >= price) {
      setError("Discounted price must be less than the original price");
      return false;
    }

    if (price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate form first
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create FormData inside the function with current values
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discounted", formData.discounted || "0");
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("totalPrice", calculateTotalPrice().toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const result = await itemApi.createItem(formDataToSend);

      // Check if request was successful
      if (result.success) {
        setSuccess(result.message);
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          discounted: "",
          quantity: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        throw new Error(result.message || "Failed to create item");
      }
    } catch (error) {
      console.error("Create item error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create New Item</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add a new item to your inventory
          </p>
        </div>
      </div>

      {/* Main Content - Flexible */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Item Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter item title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter item description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* Price Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="discounted"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Discount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            id="discounted"
                            name="discounted"
                            placeholder="0.00"
                            value={formData.discounted}
                            onChange={handleChange}
                            min="0"
                            max={formData.price || ""}
                            step="0.01"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Validation message for discounted price */}
                    {formData.discounted &&
                      formData.price &&
                      parseFloat(formData.discounted) >=
                        parseFloat(formData.price) && (
                        <p className="text-sm text-red-600">
                          Discounted price must be less than original price
                        </p>
                      )}

                    {/* Quantity and Final Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          placeholder="0"
                          value={formData.quantity}
                          onChange={handleChange}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="totalPrice"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Final Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            id="totalPrice"
                            name="totalPrice"
                            value={calculateTotalPrice()}
                            readOnly
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image *
                      </label>
                      <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 hover:border-indigo-500 transition-colors h-64 flex flex-col justify-center">
                        <div className="text-center">
                          {imagePreview ? (
                            <div className="space-y-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageFile(null);
                                  setImagePreview(null);
                                }}
                                className="text-sm text-red-600 hover:text-red-500">
                                Remove image
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48">
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                  htmlFor="image"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                  <span>Upload a file</span>
                                  <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    required={!imageFile}
                                    className="sr-only"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading || !imageFile}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading || !imageFile
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    } transition-colors duration-200`}>
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Item...
                      </div>
                    ) : (
                      "Create Item"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
