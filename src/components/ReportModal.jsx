// Filename: src/components/ReportModal.jsx
import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit, transaction, isLoading }) => {
  const [reason, setReason] = useState('');

  if (!isOpen || !transaction) return null;

  const handleSubmit = () => {
    if (!reason) {
      alert('Please select a reason.');
      return;
    }
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900">Report Transaction</h3>
        <p className="text-sm text-gray-500 mt-1">
          ID: {transaction._id}
        </p>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Please select a reason:</p>
          <div className="flex items-center">
            <input 
              type="radio" id="duplicate" name="reason" value="DUPLICATE_CHARGE" 
              checked={reason === 'DUPLICATE_CHARGE'} onChange={(e) => setReason(e.target.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="duplicate" className="ml-3 block text-sm text-gray-800">
              I was charged more than once.
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" id="not_present" name="reason" value="NOT_PRESENT" 
              checked={reason === 'NOT_PRESENT'} onChange={(e) => setReason(e.target.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="not_present" className="ml-3 block text-sm text-gray-800">
              My vehicle was not at this location.
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!reason || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;