import React from 'react';
import { ShieldPlus, Stethoscope, Pill, CheckCircle, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="font-['Segoe_UI'] bg-gradient-to-br from-blue-50 to-white text-gray-800 min-h-screen p-5 pt-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12 pb-4 border-b-2 border-blue-600">
          <ShieldPlus color="#0066cc" size={48} className="mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-blue-600 m-0 tracking-tight">
            MediCare Online Pharmacy
          </h1>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Left Side - Content */}
          <div className="p-12 flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-bold text-blue-600 mb-4 leading-tight">
              Your Health, Our Priority
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Discover top-quality medications and healthcare products 
            delivered right to your doorstep.
            </p>
            
            <div className="flex space-x-4">
              <Link className="bg-blue-600 text-white py-3 px-6 rounded-lg text-base 
                font-semibold cursor-pointer transition-all duration-300 
                hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1"
                to={'/Medicine-search'}
                >
                Check out medicine
              </Link>
              {/* <button className="bg-white text-blue-600 py-3 px-6 rounded-lg text-base 
                font-semibold cursor-pointer border border-blue-600 
                transition-all duration-300 hover:bg-blue-50">
                Consult Expert
              </button> */}
            </div>
          </div>
          
          {/* Right Side - Features */}
          <div className="bg-blue-50/50 p-12 flex flex-col justify-center space-y-6">
            <div className="flex items-center bg-white p-5 rounded-xl shadow-md transform transition-all hover:scale-105">
              <Stethoscope color="#0066cc" size={40} className="mr-5" />
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Professional Care</h3>
                <p className="text-gray-600 text-sm">Expert medical guidance at your fingertips</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white p-5 rounded-xl shadow-md transform transition-all hover:scale-105">
              <Pill color="#0066cc" size={40} className="mr-5" />
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Verified Medications</h3>
                <p className="text-gray-600 text-sm">100% authentic and quality-checked drugs</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white p-5 rounded-xl shadow-md transform transition-all hover:scale-105">
              <Droplet color="#0066cc" size={40} className="mr-5" />
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Swift and secure medication delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;