import React from "react";
import { FaEnvelope, FaFacebook, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600">Contact</h1>
          <p className="mt-3 text-gray-600">
            Feel free to connect with the developer of <span className="font-semibold">Blood Sphere</span>
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Left Info */}
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-semibold text-red-500">
              Shahariyar Ahad
            </h2>

            <p className="text-gray-600 italic">
              Junior Front End Web Developer
            </p>

            <p className="flex items-center gap-2">
              <FaEnvelope className="text-red-500" />
              <span className="font-semibold">Email:</span>
              <a
                href="mailto:iamahad9743@gamil.com"
                className="text-blue-600 hover:underline"
              >
                iamahad9743@gamil.com
              </a>
            </p>

            <p className="flex items-center gap-2">
              <FaLinkedin className="text-blue-700" />
              <span className="font-semibold">LinkedIn:</span>
              <a
                href="https://www.linkedin.com/in/shahariyar-ahad/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                linkedin.com/in/shahariyar-ahad
              </a>
            </p>

            <p className="flex items-center gap-2">
              <FaFacebook className="text-blue-600" />
              <span className="font-semibold">Facebook:</span>
              <a
                href="https://www.facebook.com/shahariyar.ahad.7"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                facebook.com/shahariyar.ahad.7
              </a>
            </p>
          </div>

          {/* Right Side Info */}
          <div className="bg-red-100 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-red-600 mb-3">
              About Blood Sphere
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Blood Sphere is a non-profit platform designed to help people
              donate blood, request blood, support funding, and read awareness
              blogs — completely free of cost. The goal is simple: save lives
              through technology and community support.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500">
          © {new Date().getFullYear()} Blood Sphere — Built with ❤️ by Shahariyar Ahad
        </div>
      </div>
    </div>
  );
};

export default Contact;
