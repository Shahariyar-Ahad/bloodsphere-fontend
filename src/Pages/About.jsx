import React from "react";

const About = () => {
    

  return (
    <div className="bg-red-50 min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600">
            About Blood Sphere
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Connecting lives through voluntary blood donation
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <div className="space-y-5 text-gray-700 text-base leading-relaxed">
            <p>
              <span className="font-semibold text-red-600">Blood Sphere</span> is
              a non-profit, community-driven platform where people can donate
              blood, request blood, support funding campaigns, and read
              life-saving blogs — all in one place.
            </p>

            <p>
              Our mission is simple: <br />
              <span className="font-semibold">
                No one should suffer or lose life due to lack of blood.
              </span>
            </p>

            <p>
              We make blood donation easier, faster, and completely{" "}
              <span className="font-semibold text-green-600">free of cost</span>.
              There are no hidden charges, no subscriptions, and no service
              fees.
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>🩸 Request blood in emergency situations</li>
              <li>🤝 Register as a voluntary blood donor</li>
              <li>💰 Support medical funding campaigns</li>
              <li>📖 Read awareness blogs about blood & health</li>
            </ul>
          </div>

          {/* Image / Card Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Why Blood Sphere?
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>✔ 100% Free Platform</p>
              <p>✔ Fast & Reliable Blood Requests</p>
              <p>✔ Trusted Community Donors</p>
              <p>✔ Mobile Friendly & Easy to Use</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-red-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Together, We Can Save Lives ❤️
          </h2>
          <p className="max-w-3xl mx-auto text-lg">
            Whether you donate blood, request help, support funding, or spread
            awareness — you are becoming a part of something meaningful.
            Blood Sphere exists because humanity still cares.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
