import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const UserLayout = ({ children }) => {
  const { vehicleNumber } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: `/dashboard/${vehicleNumber}` },
    { name: 'Transactions', path: `/dashboard/${vehicleNumber}/transactions` },
    { name: 'Recharge History', path: `/dashboard/${vehicleNumber}/recharge-history` },
    { name: 'Device Management', path: `/dashboard/${vehicleNumber}/device` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Toll Management System</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm">
                Vehicle: {vehicleNumber}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mb-px">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-500 hover:text-blue-600 font-medium py-3 px-4 border-b-2 border-transparent hover:border-blue-500 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;