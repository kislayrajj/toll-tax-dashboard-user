import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { apiService } from '../services/apiService';
import { DataCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components/DataDisplay';
import UserLayout from '../components/UserLayout';

const UserRechargeHistory = () => {
  const { vehicleNumber } = useParams();
  const { data: vehicleData, isLoading, error, refetch } = useFetch(`/vehicles/plate/${vehicleNumber}`);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isRecharging, setIsRecharging] = useState(false);
  const [modalError, setModalError] = useState('');

  // Use embedded IoT device data from vehicle
  const deviceData = vehicleData?.iotDevice;

  const handleRecharge = async () => {
    if (!deviceData) {
      setRechargeError('No IoT device assigned to this vehicle');
      return;
    }
    if (!rechargeAmount || rechargeAmount <= 0) {
      setRechargeError('Please enter a valid amount');
      return;
    }

    setIsRecharging(true);
    setModalError('');

    try {
      await apiService.patch('/iot/recharge', {
        tagId: deviceData.tagId,
        amount: parseFloat(rechargeAmount)
      });
      setShowRechargeModal(false);
      setRechargeAmount('');
      refetch();
    } catch (err) {
      setModalError(err.message || 'Failed to recharge device');
    } finally {
      setIsRecharging(false);
    }
  };

  if (isLoading) {
    return (
      <UserLayout>
        <DataCard title="Recharge History">
          <LoadingSpinner message="Loading recharge history..." />
        </DataCard>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <DataCard title="Recharge History">
          <ErrorMessage message={error.message} onRetry={refetch} />
        </DataCard>
      </UserLayout>
    );
  }

  const rechargeData = []; // Replace with real recharge data from API when available


  return (
    <UserLayout>
      <DataCard
        title="Recharge History"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setShowRechargeModal(true)}
            disabled={!vehicleData?.iotDevice}
          >
            Recharge Device
          </button>
        }
      >
        {!vehicleData?.iotDevice && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
            <svg className="h-6 w-6 text-yellow-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No IoT Device Assigned</h3>
              <p className="mt-1 text-sm text-yellow-700">Assign an IoT device to recharge your vehicle.</p>
            </div>
          </div>
        )}

        {rechargeData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rechargeData.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm">{new Date(r.dateTime).toLocaleString()}</td>
                    <td className="py-2 px-4 text-sm text-green-600 font-medium">+₹{r.amount}</td>
                    <td className="py-2 px-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No recharge history found." />
        )}
      </DataCard>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recharge Device</h2>
              <button onClick={() => setShowRechargeModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">Vehicle Number</label>
              <input type="text" className="form-input bg-gray-100" value={vehicleNumber} readOnly />

              <label className="block text-gray-700 font-medium">Device Tag ID</label>
              <input type="text" className="form-input bg-gray-100" value={deviceData?.tagId || 'No device assigned'} readOnly />

              <label className="block text-gray-700 font-medium">Amount (₹)</label>
              <input type="number" className="form-input" placeholder="Enter amount" value={rechargeAmount} onChange={e => setRechargeAmount(e.target.value)} disabled={isRecharging} />
              {modalError && <p className="text-red-500 text-sm">{modalError}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowRechargeModal(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" disabled={isRecharging}>Cancel</button>
              <button onClick={handleRecharge} className="btn btn-primary" disabled={isRecharging}>{isRecharging ? 'Recharging...' : 'Recharge'}</button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserRechargeHistory;
