import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataCard } from '../components/DataDisplay';
import { apiService } from '../services/apiService';

const VehicleLogin = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedVehicle = vehicleNumber.trim().toUpperCase();
    if (!trimmedVehicle) return;

    try {
      setLoading(true);
      const vehicle = await apiService.get(`/vehicles/plate/${trimmedVehicle}`);

      if (vehicle) {
        navigate(`/dashboard/${trimmedVehicle}`);
      } else {
        setError('Vehicle not found in the database.');
      }
    } catch (err) {
      setError(err.message || 'Error checking vehicle number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <DataCard className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">Toll Management System</h1>
          <p className="text-gray-600 text-sm sm:text-base">Enter your vehicle number to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Number
            </label>
            <input
              id="vehicleNumber"
              type="text"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="e.g., KA01MJ5555"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())} // auto uppercase
              required
            />
            <p className="mt-2 text-sm text-gray-500">Enter your vehicle's license plate number</p>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600 text-sm sm:text-base">
          Admin access?{' '}
          <a
            href="/admin/vehicles"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
          >
            Login here
          </a>
        </div>
      </DataCard>
    </div>
  );
};

export default VehicleLogin;
