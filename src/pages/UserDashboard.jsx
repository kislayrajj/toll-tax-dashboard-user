import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { DataCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components/DataDisplay';
import UserLayout from '../components/UserLayout';

const UserDashboard = () => {
  const { vehicleNumber } = useParams();

  // 1. Fetch vehicle data by plate number
  const { data: vehicle, isLoading: loadingVehicle, error: vehicleError } = useFetch(`/vehicles/plate/${vehicleNumber}`);

  // 2. Fetch transactions specific to this vehicle
  const { data: transactions, isLoading: loadingTx, error: txError } = useFetch(vehicle ? `/transactions/vehicle/${vehicle._id}` : null);

   if (loadingVehicle || loadingTx) {
     return <UserLayout><LoadingSpinner message="Loading dashboard data..." /></UserLayout>;
   }

   if (vehicleError || txError || !vehicle) {
     return (
       <UserLayout>
         <DataCard>
           <ErrorMessage message={vehicleError?.message || txError?.message || `Vehicle with plate number '${vehicleNumber}' not found.`} />
         </DataCard>
       </UserLayout>
     );
   }

  // Device info and stats
  const iotDevice = vehicle.iotDevice;
  const deviceBalance = iotDevice?.balance ?? 0;
  const deviceStatus = iotDevice ? (iotDevice.active ? 'Active' : 'Inactive') : 'Not Assigned';
  const totalTransactions = transactions.length;

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dashboard</h1>

        {/* Vehicle Information */}
        <DataCard title="Vehicle Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Plate Number:</span>
              <span className="font-medium">{vehicle.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Owner Name:</span>
              <span className="font-medium">{vehicle.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle Type:</span>
              <span className="font-medium capitalize">{vehicle.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Home Town:</span>
              <span className="font-medium">{vehicle.homeTown ? `${vehicle.homeTown.coordinates[1]}, ${vehicle.homeTown.coordinates[0]}` : 'N/A'}</span>
            </div>
          </div>
        </DataCard>

        {/* Stats Widgets */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<DataCard className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-2xl transition-all rounded-xl p-6 flex flex-col justify-between group">
  {/* Default info */}
  <div>
    <h2 className="text-sm sm:text-base font-semibold text-white/80 mb-2 truncate">Device Balance</h2>
    <p className="text-2xl sm:text-3xl font-bold truncate break-words">₹{deviceBalance.toFixed(2)}</p>
  </div>

  {/* Hover overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col justify-center items-center p-4 text-center">
    <p className="text-lg sm:text-xl font-semibold">Total Balance Details</p>
    <p className="text-sm sm:text-base mt-2">
      Current Balance: ₹{deviceBalance.toFixed(2)} 
    </p>
  </div>
</DataCard>


  <DataCard className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:shadow-2xl transition-all rounded-xl p-6 flex flex-col justify-between">
    <h2 className="text-sm sm:text-base font-semibold text-white/80 mb-2 truncate">Total Transactions</h2>
    <p className="text-2xl sm:text-3xl font-bold truncate break-words">{totalTransactions}</p>
  </DataCard>

  <DataCard className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-2xl transition-all rounded-xl p-6 flex flex-col justify-between">
    <h2 className="text-sm sm:text-base font-semibold text-white/80 mb-2 truncate">Device Status</h2>
    <p className="text-2xl sm:text-3xl font-bold truncate break-words">{deviceStatus}</p>
  </DataCard>
</div>


        {/* Recent Transactions */}
        <DataCard title="Recent Transactions" className="p-6">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx._id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{tx.boothId?.name || 'Unknown Booth'}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">- ₹{tx.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 capitalize">{tx.status?.replace(/_/g, ' ') || 'Completed'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No recent transactions found." />
          )}
        </DataCard>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
