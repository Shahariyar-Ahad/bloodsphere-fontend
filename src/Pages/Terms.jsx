import React from "react";

const Terms = () => {
  return (
    <section className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-4xl mx-auto card bg-base-200 rounded-2xl shadow-md border border-base-300 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Terms of Use
        </h1>

        <p className="mb-4">
          Welcome to <strong>Blood Sphere</strong>. By accessing or using our
          platform, you agree to comply with and be bound by the following
          terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Platform Purpose
        </h2>
        <p>
          Blood Sphere is a voluntary blood donation platform designed to
          connect donors with recipients. We do not sell blood or charge for
          donations.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. User Responsibility
        </h2>
        <p>
          Users must provide accurate and truthful information. Any misuse,
          false data submission, or fraudulent activity may result in account
          suspension.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Medical Disclaimer
        </h2>
        <p>
          Blood Sphere does not provide medical advice. Users are responsible
          for consulting qualified healthcare professionals before donating
          or receiving blood.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Account Termination
        </h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          our terms without prior notice.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default Terms;
