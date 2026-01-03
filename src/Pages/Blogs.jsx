import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import PageLoader from './PageLoader';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
      const [pageLoading, setPageLoading] = useState(true);
    useEffect(() => {
        fetch('/Blog.json')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Error loading JSON:", err))
            .finally(() => setPageLoading(false));
    }, []);
     if (pageLoading) {
  return <PageLoader />;
}

    return (
        <div className="bg-gray-50 pb-20 font-sans">
            {/* Header Section */}
            <div className="bg-[#001F3D] py-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                    BloodSphere <span className="text-red-500 underline underline-offset-8">Insights</span>
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg italic mt-4">
                    Every drop tells a story. Explore our articles on health, community, and the life-saving impact of blood donation.
                </p>
            </div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 mt-10 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group rounded-2xl overflow-hidden"
                        >
                            <figure className="relative h-56 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="badge badge-error text-white font-bold p-2 uppercase text-[10px] tracking-widest shadow-lg border-none">
                                        {blog.category}
                                    </span>
                                </div>
                            </figure>

                            <div className="card-body p-6">
                                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt className="text-red-500" /> {blog.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaUser className="text-red-500" /> Admin
                                    </div>
                                </div>
                                <h2 className="card-title text-xl font-extrabold text-[#001F3D] group-hover:text-red-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-3">
                                    {blog.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="max-w-4xl mx-auto px-4 mt-20">
                <div className="bg-red-50 rounded-[2rem] p-8 md:p-12 text-center border-2 border-dashed border-red-200">
                    <h2 className="text-3xl font-black text-[#001F3D] mb-2">Subscribe for Updates</h2>
                    <p className="text-gray-600 mb-6">Get the latest life-saving tips and stories delivered to your inbox.</p>
                    <div className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered flex-1 rounded-full px-6 focus:outline-red-500"
                        />
                        <button className="btn btn-error rounded-full text-white px-8 font-bold border-none bg-red-600 hover:bg-red-700 transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogs;


