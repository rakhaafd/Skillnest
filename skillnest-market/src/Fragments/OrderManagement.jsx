import React, { useState, useEffect } from 'react';
import { User, ShoppingCart } from 'lucide-react';
import SellerStatusLabel from '../Components/SellerStatusLabel';

const OrderManagement = ({ itemId, sellerId }) => {
  const [itemOrders, setItemOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://api.skillnest.site/api';

  useEffect(() => {
    const fetchItemOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/orders/seller`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(order => order.market_item_id === itemId);
          setItemOrders(filtered);
        }
      } catch (err) {
        console.error('Error fetching item orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId && sellerId) fetchItemOrders();
  }, [itemId, sellerId]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal update status');

      setItemOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ShoppingCart size={20} className="text-indigo-600" />
        Manajemen Pesanan
        {itemOrders.length > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
            {itemOrders.length} pesanan
          </span>
        )}
      </h2>

      {itemOrders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">Belum ada pesanan masuk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {itemOrders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.buyer?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.buyer?.email}</p>
                  </div>
                </div>

                <SellerStatusLabel status={order.status}/>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>Order #{order.id}</span>
                  <span className="mx-2">•</span>
                  <span>Rp {Number(order.price).toLocaleString('id-ID')}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        {updatingOrderId === order.id ? 'Loading...' : 'Konfirmasi Bayar'}
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        Batalkan
                      </button>
                    </>
                  )}

                  {order.status === 'paid' && (
                    <>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        {updatingOrderId === order.id ? 'Loading...' : 'Selesaikan'}
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                      >
                        Batalkan
                      </button>
                    </>
                  )}

                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg">
                      Final
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;