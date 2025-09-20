import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { DataCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components/DataDisplay';
import UserLayout from '../components/UserLayout';

const UserTransactions = () => {
  const { vehicleNumber } = useParams();

  // Fetch vehicle data to get vehicle ID
  const { data: vehicle, isLoading: vehicleLoading, error: vehicleError } = useFetch(`/vehicles/plate/${vehicleNumber}`);

  // Fetch all transactions (filter client-side for this vehicle)
  const { data: allTransactions, isLoading: transactionsLoading, error: transactionsError } = useFetch('/transactions');

  const isLoading = vehicleLoading || transactionsLoading;
  const error = vehicleError || transactionsError;

  if (isLoading) {
    return (
      <UserLayout>
        <DataCard title="Transaction History">
          <LoadingSpinner message="Loading transactions..." />
        </DataCard>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <DataCard title="Transaction History">
          <ErrorMessage message={error.message} />
        </DataCard>
      </UserLayout>
    );
  }

  // Filter transactions for this vehicle
  const transactions = allTransactions?.filter(tx => {
    const txVehicleId = tx.vehicleId?._id || tx.vehicleId;
    return txVehicleId === vehicle._id || txVehicleId === vehicle._id.toString();
  }) || [];

  return (
    <UserLayout>
      <DataCard title="Transaction History">
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toll Booth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tx.boothId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold" title={`Transaction ID: ${tx._id}`}>
                      - ₹{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {tx.status.replace(/_/g, ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No transactions found." />
        )}
      </DataCard>
    </UserLayout>
  );
};

export default UserTransactions;
