import React from "react";

const campaigns = [
  {
    id: 1,
    title: "Emergency Blood Donation Camp",
    location: "Dhaka Medical College Hospital",
    date: "15 March 2026",
    organizer: "Blood Sphere Volunteers",
    description:
      "This campaign focuses on collecting emergency blood units for critical patients in government hospitals.",
  },
  {
    id: 2,
    title: "University Blood Drive",
    location: "BUET Campus, Dhaka",
    date: "22 March 2026",
    organizer: "Blood Sphere & Student Community",
    description:
      "A student-led initiative to encourage young donors to contribute towards saving lives.",
  },
  {
    id: 3,
    title: "Community Blood Donation Program",
    location: "Mirpur Community Center",
    date: "5 April 2026",
    organizer: "Blood Sphere",
    description:
      "A local community campaign aimed at ensuring blood availability for nearby clinics and hospitals.",
  },
];

const Campaigns = () => {
  return (
    <section className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Blood Donation Campaigns
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Join our organized blood donation campaigns and help ensure a
            reliable blood supply for patients in need.
          </p>
        </div>

        {/* Campaign Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="card bg-base-200 rounded-2xl shadow-md border border-base-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                  {campaign.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {campaign.description}
                </p>

                <div className="text-sm space-y-1">
                  <p>
                    <strong>Date:</strong> {campaign.date}
                  </p>
                  <p>
                    <strong>Location:</strong> {campaign.location}
                  </p>
                  <p>
                    <strong>Organizer:</strong> {campaign.organizer}
                  </p>
                </div>
              </div>

              <button className="btn btn-error btn-outline mt-6 w-full">
                Join Campaign
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
