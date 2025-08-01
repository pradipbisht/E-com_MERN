import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.25)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        }}></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-24 lg:py-0">
          {/* Left Column: Text Content & CTAs */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Find Your Next
                <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                  Favorite Thing.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                Explore our curated collection of high-quality products,
                designed to bring joy and utility into your life.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#products"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all duration-300">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
                <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#deals"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-transparent text-gray-200 font-semibold rounded-lg border border-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-300">
                Learn More
              </a>
            </div>

            {/* Social Proof / Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Trusted by <span className="font-bold text-white">50,000+</span>{" "}
                customers
              </p>
            </div>
          </div>

          {/* Right Column: Visual Element */}
          <div className="hidden lg:block">
            <div className="relative w-full h-full p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
              <img
                src="https://placehold.co/600x400/111827/FFFFFF?text=Product+Showcase"
                alt="Product Showcase"
                className="rounded-2xl w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/111827/FFFFFF?text=Image+Error";
                }}
              />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-50 blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-50 blur-2xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
