import React from "react";

const Cookies = () => {
  return (
    <section className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-4xl mx-auto card bg-base-200 rounded-2xl shadow-md border border-base-300 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Cookie Policy
        </h1>

        <p className="mb-4">
          Blood Sphere uses cookies to enhance user experience and ensure
          secure platform functionality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. What Are Cookies
        </h2>
        <p>
          Cookies are small data files stored on your device to remember user
          preferences and login sessions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. How We Use Cookies
        </h2>
        <p>
          We use cookies for authentication, security, and performance
          optimization.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Managing Cookies
        </h2>
        <p>
          You can disable cookies through your browser settings, but some
          features may not function properly.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default Cookies;
