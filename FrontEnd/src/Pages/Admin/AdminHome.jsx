import React, { useEffect, useState } from 'react';

const AdminHome = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Check if the page has already reloaded
    if (!sessionStorage.getItem("hasReloaded")) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload(); // Reload the page
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'products':
        return <div className="text-center text-2xl text-blue-800 p-8">Products Management Page</div>;
      case 'orders':
        return <div className="text-center text-2xl text-blue-800 p-8">Orders Management Page</div>;
      case 'users':
        return <div className="text-center text-2xl text-blue-800 p-8">Users Management Page</div>;
      case 'prescriptions':
        return <div className="text-center text-2xl text-blue-800 p-8">Prescriptions Review Page</div>;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { title: 'Total Orders', value: '150' },
              { title: 'Active Users', value: '1,234' },
              { title: 'Total Products', value: '567' },
              { title: 'Revenue', value: '₹45,678' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 border border-blue-200"
              >
                <h3 className="text-blue-600 text-lg font-semibold mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 mt-36">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl text-center text-blue-900 font-bold mb-8">
          Admin Dashboard
        </h1>
        
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Manage Products', page: 'products' },
            { label: 'View Orders', page: 'orders' },
            { label: 'Manage Users', page: 'users' },
            { label: 'Review Prescriptions', page: 'prescriptions' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(action.page)}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm sm:text-base 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition duration-300 ease-in-out transform hover:scale-105"
            >
              {action.label}
            </button>
          ))}
        </div> */}

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminHome;