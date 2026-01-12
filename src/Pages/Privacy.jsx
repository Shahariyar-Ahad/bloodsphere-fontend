import React from "react";

const Privacy = () => {
  return (
    <section className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-4xl mx-auto card bg-base-200 rounded-2xl shadow-md border border-base-300 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Privacy Policy
        </h1>

        <p className="mb-4">
          Your privacy is important to us. This policy explains how Blood
          Sphere collects, uses, and protects your personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p>
          We collect personal data such as name, blood group, location, and
          contact information solely for blood donation coordination.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Data Usage
        </h2>
        <p>
          Your information is used only to connect donors with recipients and
          improve our services. We never sell user data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Data Security
        </h2>
        <p>
          We implement industry-standard security measures to protect your
          data from unauthorized access.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. User Rights
        </h2>
        <p>
          Users may request data updates or deletion by contacting our support
          team.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default Privacy;
