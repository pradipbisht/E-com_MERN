import React from "react";

const companyInfo = {
  name: "Acme Innovations",
  founded: 2010,
  employees: 120,
  mission:
    "To deliver cutting-edge solutions that empower businesses and enrich lives.",
  values: [
    "Integrity",
    "Innovation",
    "Customer Focus",
    "Collaboration",
    "Sustainability",
  ],
  description:
    "Acme Innovations is a leading provider of technology solutions, specializing in cloud computing, AI, and digital transformation. Our team is passionate about driving progress and making a positive impact in the world.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About {companyInfo.name}
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Description Section */}
          <div className="p-8 lg:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {companyInfo.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {companyInfo.founded}
                </div>
                <div className="text-gray-600 font-medium">Founded</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {companyInfo.employees}+
                </div>
                <div className="text-gray-600 font-medium">Employees</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {new Date().getFullYear() - companyInfo.founded}
                </div>
                <div className="text-gray-600 font-medium">
                  Years of Excellence
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-6 rounded-xl border-l-4 border-blue-600">
                {companyInfo.mission}
              </p>
            </div>

            {/* Values Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </span>
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyInfo.values.map((value, index) => (
                  <div
                    key={value}
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Work With Us?
            </h3>
            <p className="text-gray-600 mb-6">
              Join us in our mission to deliver innovative solutions and make a
              positive impact.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
