import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VehicleLogin from './pages/VehicleLogin';
import UserDashboard from './pages/UserDashboard';
import UserTransactions from './pages/UserTransactions';
import UserRechargeHistory from './pages/UserRechargeHistory';
import UserDeviceManagement from './pages/UserDeviceManagement';


function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<VehicleLogin />} />
          <Route path="/dashboard/:vehicleNumber" element={<UserDashboard />} />
          <Route path="/dashboard/:vehicleNumber/transactions" element={<UserTransactions />} />
          <Route path="/dashboard/:vehicleNumber/recharge-history" element={<UserRechargeHistory />} />
          <Route path="/dashboard/:vehicleNumber/device" element={<UserDeviceManagement />} />
         
        </Routes>
      </main>
    </div>
  );
}

export default App;