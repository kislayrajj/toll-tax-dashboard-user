import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { apiService } from '../services/apiService';
import { DataCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components/DataDisplay';
import UserLayout from '../components/UserLayout';

const UserDeviceManagement = () => {
  const { vehicleNumber } = useParams();
  const { data: vehicleData, isLoading, error, refetch } = useFetch(`/vehicles/plate/${vehicleNumber}`);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Use embedded IoT device data from vehicle
  const deviceData = vehicleData?.iotDevice;

  // Assign IoT device to vehicle
  const handleAssignDevice = async () => {
    if (!deviceId.trim()) {
      setAssignError('Please enter a device ID');
      return;
    }

    setIsAssigning(true);
    setAssignError('');

    try {
      await apiService.post('/iot/assign', {
        plateNumber: vehicleNumber,
        tagId: deviceId.trim().toUpperCase(),
      });
      setShowAssignModal(false);
      setDeviceId('');
      refetch();
    } catch (err) {
      setAssignError(err.message || 'Failed to assign device');
    } finally {
      setIsAssigning(false);
    }
  };

  // Unassign IoT device
   const handleUnassignDevice = async () => {
     if (!vehicleData?.iotDevice) {
       alert('No device assigned to this vehicle');
       return;
     }

     if (window.confirm('Are you sure you want to unassign this device?')) {
       try {
         await apiService.delete(`/iot/${vehicleData.iotDevice.tagId}`);
         refetch();
       } catch (err) {
         alert(err.message || 'Failed to unassign device');
       }
     }
   };

  if (isLoading) {
    return (
      <UserLayout>
        <DataCard title="Device Management">
          <LoadingSpinner message="Loading device information..." />
        </DataCard>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <DataCard title="Device Management">
          <ErrorMessage message={error.message} onRetry={refetch} />
        </DataCard>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Device Info */}
        <DataCard title="Device Information">
          {vehicleData?.iotDevice ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Device Details</h3>
                <div className="flex justify-between"><span className="text-gray-600">Device ID:</span><span className="font-medium">{deviceData.tagId}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${deviceData.active ? 'text-green-600' : 'text-red-600'}`}>
                    {deviceData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-gray-600">Balance:</span><span className="font-medium break-all">₹{deviceData.balance.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Created At:</span><span className="font-medium">{new Date(deviceData.createdAt).toLocaleString()}</span></div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
                <button className="w-full btn btn-primary" onClick={() => alert('Recharge available in Recharge History')}>Recharge Device</button>
                <button className="w-full btn btn-outline" onClick={() => setShowAssignModal(true)}>Reassign Device</button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleUnassignDevice}>Unassign Device</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <EmptyState message="No Device Assigned" />
              <button className="btn btn-primary" onClick={() => setShowAssignModal(true)}>Assign Device</button>
            </div>
          )}
        </DataCard>

        {/* Device Activity */}
        {vehicleData?.iotDevice && (
          <DataCard title="Device Activity">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`${deviceData.active ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {deviceData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance:</span>
                <span className="font-medium break-all">₹{deviceData.balance.toFixed(2)}</span>
              </div>
            </div>
          </DataCard>
        )}
      </div>

      {/* Assign Device Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Assign IoT Device</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">Vehicle Number</label>
              <input type="text" className="form-input bg-gray-100" value={vehicleNumber} readOnly />

              <label className="block text-gray-700 font-medium">Device Tag ID</label>
              <input type="text" className="form-input" placeholder="Enter device tag ID" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} disabled={isAssigning} />
              {assignError && <p className="text-red-500 text-sm">{assignError}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100" disabled={isAssigning}>Cancel</button>
              <button onClick={handleAssignDevice} className="btn btn-primary" disabled={isAssigning}>{isAssigning ? 'Assigning...' : 'Assign Device'}</button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserDeviceManagement;
