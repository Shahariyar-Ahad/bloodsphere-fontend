import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { useNavigate } from 'react-router';

const RequestCard = ({req}) => {
 const {user}=useContext(AuthContext) 
 const navigate=useNavigate();
 const handleClick= () => { 
    if(!user){
        return navigate('/login',{
          state: {message: "please login first"}
        })
    } 
    else navigate(`/donation-requests/${req._id}`)
   
 }
    return (
        
  <div
  key={req._id}
  className="cursor-pointer  p-5 rounded-xl border border-black
             hover:border-red-500 hover:shadow-xl transition-all duration-300 bg-red-500"
>
  {/* Blood Group Display */}
  
  <div className="w-full h-28 flex justify-center items-center rounded-lg bg-red-200 mb-3 border-2 border-red-500">
    <span className="text-4xl font-extrabold text-red-500">
      {req.bloodGroup}
    </span>
  </div>

  {/* Title */}
  <h2 className="text-red-500 font-bold text-lg">
    Blood Needed
  </h2>

  {/* Hospital */}
  <p className="text-black text-md font-bold">
    🏥 {req.hospitalName}
  </p>

  {/* Location */}
  <p className="text-white text-sm">
    📍 {req.upazila}, {req.district}
  </p>

  {/* Bottom Section */}
  <div className="flex justify-between items-center gap-2 mt-4"> 
  {/* Date Badge */}
  <div className="flex items-center gap-2 bg-white text-red-400 px-2 py-2 rounded-md text-sm font-bold shadow-sm">
    <span>🗓</span> {new Date(req.donationDate).toLocaleDateString()}
  </div>

  {/* Time Badge */}
  <div className="flex items-center gap-2 bg-blue-400 text-black px-2 py-2 rounded-md text-sm font-extrabold shadow-sm">
    <span>🕒</span> {req.donationTime}
  </div>

  {/* Action Button */}
  <button
    onClick={handleClick}
    className="bg-black text-white px-3 py-2 rounded-md text-sm font-extrabold hover:bg-gray-800 transition-colors"
  >
    View
  </button>
</div>
</div>



    );
};

export default RequestCard;