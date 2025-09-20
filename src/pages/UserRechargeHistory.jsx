import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch } from "../hooks/useFetch";
import { apiService } from "../services/apiService";
import {
  DataCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../components/DataDisplay";
import UserLayout from "../components/UserLayout";

const UserRechargeHistory = () => {
  const { vehicleNumber } = useParams();
  const queryClient = useQueryClient();

  const {
    data: vehicleData,
    isLoading: isVehicleLoading,
    error: vehicleError,
  } = useFetch(`/vehicles/plate/${vehicleNumber}`);
  const tagId = vehicleData?.iotDevice?.tagId;

  const {
    data: rechargeHistory,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useFetch(tagId ? `/iot/${tagId}/rechargeHistory` : null);

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRecharge = async () => {
    if (!tagId || !rechargeAmount || rechargeAmount <= 0) {
      setModalError("Please enter a valid amount");
      return;
    }
    setIsRecharging(true);
    setModalError("");
    setSuccessMessage("");
    try {
      await apiService.patch("/iot/recharge", {
        tagId: tagId,
        amount: parseFloat(rechargeAmount),
      });
      setSuccessMessage(`Successfully recharged ₹${rechargeAmount}`);
      setShowRechargeModal(false);
      setRechargeAmount("");
      queryClient.invalidateQueries({
        queryKey: ["vehicles", "plate", vehicleNumber],
      });
   // Inside the handleRecharge function...

// Find this line:
queryClient.invalidateQueries({ queryKey: ["iot", tagId, "history"] });

// And change it to match the API route:
queryClient.invalidateQueries({ queryKey: ["iot", tagId, "rechargeHistory"] });
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {

      console.error("API Recharge Failed:", err);

      setModalError(err.message || "Failed to recharge device");
    } finally {
      setIsRecharging(false);
    }
  };

  if (isVehicleLoading) {
    return (
      <UserLayout>
        <DataCard title="Recharge History">
          <LoadingSpinner message="Loading vehicle details..." />
        </DataCard>
      </UserLayout>
    );
  }

  if (vehicleError) {
    return (
      <UserLayout>
        <DataCard title="Recharge History">
          <ErrorMessage message={vehicleError.message} />
        </DataCard>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DataCard
        title="Recharge History"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setShowRechargeModal(true)}
            disabled={!tagId}>
            Recharge Device
          </button>
        }>
        {/* RESTORED: More visible success alert */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
            <svg
              className="h-6 w-6 text-green-400 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Recharge Successful!
              </h3>
              <p className="mt-1 text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {!tagId && (
          <EmptyState message="No IoT device is assigned to this vehicle." />
        )}

        {tagId && isHistoryLoading && (
          <LoadingSpinner message="Loading recharge history..." />
        )}
        {tagId && !isHistoryLoading && historyError && (
          <ErrorMessage message={historyError.message} />
        )}
        {tagId &&
          !isHistoryLoading &&
          !historyError &&
          (rechargeHistory?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                      Date & Time
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rechargeHistory.map((recharge) => (
                    <tr key={recharge._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm">
                        {new Date(recharge.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-sm text-green-600 font-medium">
                        +₹{recharge.amount}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 capitalize">
                          {recharge.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No recharge history found." />
          ))}
      </DataCard>

      {showRechargeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recharge Device</h2>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">
                Device Tag ID
              </label>
              <input
                type="text"
                className="form-input bg-gray-100"
                value={tagId || "N/A"}
                readOnly
              />
              <label className="block text-gray-700 font-medium">
                Amount (₹)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                disabled={isRecharging}
              />
              {modalError && (
                <p className="text-red-500 text-sm">{modalError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                disabled={isRecharging}>
                Cancel
              </button>
              <button
                onClick={handleRecharge}
                className="btn btn-primary"
                disabled={isRecharging}>
                {isRecharging ? "Recharging..." : "Recharge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserRechargeHistory;
