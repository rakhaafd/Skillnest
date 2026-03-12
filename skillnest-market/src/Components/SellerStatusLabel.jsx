import React from 'react';
import {
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

const SellerStatusLabel = ({ status }) => {
  if (!status) return null;

  const config = {
    pending: {
      icon: HiOutlineClock,
      label: 'Pending',
      style: 'bg-yellow-100 text-yellow-700',
    },
    paid: {
      icon: HiOutlineCreditCard,
      label: 'Paid',
      style: 'bg-blue-100 text-blue-700',
    },
    completed: {
      icon: HiOutlineCheckCircle,
      label: 'Completed',
      style: 'bg-green-100 text-green-700',
    },
    cancelled: {
      icon: HiOutlineXCircle,
      label: 'Cancelled',
      style: 'bg-red-100 text-red-700',
    },
  };

  const { icon: Icon, label, style } = config[status] ?? config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      <Icon className="text-sm" />
      {label}
    </span>
  );
};

export default SellerStatusLabel;