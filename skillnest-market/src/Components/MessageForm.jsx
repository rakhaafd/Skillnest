import React, { useState } from 'react';
import { MessageCircle, CheckCircle, XCircle, X, Send } from 'lucide-react';
import Button from '../Components/Button';

const MessageForm = ({ item, user, onClose, onOrderSuccess }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const API_URL = 'http://api.skillnest.site/api';

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Silakan isi pesan Anda');
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('auth_token');

      // Step 1: Buat order
      const orderResponse = await fetch(`${API_URL}/orders/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok && orderResponse.status !== 409) {
        throw new Error(orderData.message || 'Gagal membuat pesanan');
      }

      // Step 2: Kirim pesan ke seller
      const messageResponse = await fetch(`${API_URL}/contact-seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: item.id,
          buyer_email: user.email,
          message: message.trim()
        })
      });

      const messageData = await messageResponse.json();
      if (!messageResponse.ok) throw new Error(messageData.message || 'Gagal mengirim pesan');

      setStatus('success');
      setMessage('');
      if (onOrderSuccess) onOrderSuccess();

      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 3000);

    } catch (err) {
      console.error('Error:', err);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>

      <h3 className="font-semibold mb-3 flex items-center">
        <MessageCircle size={18} className="mr-2 text-indigo-600" />
        Kirim Pesan ke Penjual
      </h3>

      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
          <CheckCircle size={18} className="mr-2" />
          Pesanan berhasil dibuat! Pesan telah dikirim ke penjual. Tunggu konfirmasi dari penjual.
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <XCircle size={18} className="mr-2" />
          Gagal mengirim pesan. Silakan coba lagi.
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tulis pesan Anda di sini..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
        disabled={sending || status === 'success'}
      />

      <div className="flex justify-end mt-3">
        <Button
          text={sending ? 'Mengirim...' : 'Kirim Pesan'}
          variant="solid"
          icon={sending ? null : <Send size={16} />}
          onClick={handleSend}
          disabled={sending || status === 'success' || !message.trim()}
        />
      </div>
    </div>
  );
};

export default MessageForm;