import React from 'react';
import { 
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

const OrderStatusLabel = ({ status, className="" }) => {
  if (!status) return null;

  const config = {
    pending: {
      icon: HiOutlineClock,
      label: 'Menunggu Konfirmasi Penjual',
      description: 'Penjual akan segera mengkonfirmasi pesanan kamu.',
      container: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-700',
    },
    paid: {
      icon: HiOutlineCreditCard,
      label: 'Pembayaran Dikonfirmasi',
      description: 'Penjual sedang memproses pesanan kamu.',
      container: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
    },
    completed: {
      icon: HiOutlineCheckCircle,
      label: 'Transaksi Selesai',
      description: 'Terima kasih! Kamu sudah bisa memberikan ulasan.',
      container: 'bg-green-50 border-green-200',
      text: 'text-green-700',
    },
    cancelled: {
      icon: HiOutlineXCircle,
      label: 'Pesanan Dibatalkan',
      description: 'Pesanan kamu telah dibatalkan oleh penjual.',
      container: 'bg-red-50 border-red-200',
      text: 'text-red-700',
    },
  };

  const { icon: Icon, label, description, container, text } =
    config[status] ?? config.pending;

  return (
    <div className={`mt-4 p-4 rounded-lg border flex items-center gap-3 ${container}`}>
      <Icon className={`text-2xl ${text}`} />
      <div>
        <p className={`font-semibold text-sm ${text}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export default OrderStatusLabel;