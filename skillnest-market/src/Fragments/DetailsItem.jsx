  import React, { useState, useEffect } from 'react';
  import {
    ArrowLeft,
    User,
    Star,
    Clock,
    ShoppingCart,
    AlertCircle,
    ImageOff,
    Pencil,
    X
  } from 'lucide-react';
  import Navbar from '../Layouts/Navbar';
  import Footer from '../Layouts/Footer';
  import Button from '../Components/Button';
  import ReviewItem from '../Fragments/ReviewItem';
  import OrderManagement from './OrderManagement';
  import OrderStatusLabel from '../Components/OrderStatusLabel';
  import MessageForm from '../Components/MessageForm';

  const DetailsItem = () => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageError, setImageError] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const [showMessageForm, setShowMessageForm] = useState(false);

    const [averageRating, setAverageRating] = useState(0);
    const [buyerOrderStatus, setBuyerOrderStatus] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);

    const API_URL = 'http://api.skillnest.site/api';

    const isOwner = user && item && String(user.id) === String(item.user_id);


    // Cek auth status
    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }, []);

    // Get ID from URL
    const getItemIdFromUrl = () => {
      const path = window.location.pathname;
      const matches = path.match(/\/details\/(\d+)/);
      return matches ? matches[1] : null;
    };

    // Fetch item details
    useEffect(() => {
      const fetchItemDetails = async () => {
        try {
          setLoading(true);
          const itemId = getItemIdFromUrl();

          if (!itemId) throw new Error('ID item tidak ditemukan');

          const response = await fetch(`${API_URL}/items/${itemId}`, {
            headers: { 'Accept': 'application/json' }
          });

          if (!response.ok) throw new Error(`Gagal mengambil data (Status: ${response.status})`);

          const data = await response.json();
          if (!data.user) data.user = { name: 'Unknown', created_at: null };

          setItem(data);
          setImageError(false);
          setError(null);
        } catch (err) {
          console.error('Error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchItemDetails();
    }, []);

    // Fetch reviews untuk update rating
    useEffect(() => {
      const fetchReviews = async () => {
        if (!item?.id) return;
        try {
          const response = await fetch(`${API_URL}/items/${item.id}/reviews`);
          if (response.ok) {
            const data = await response.json();
            // ✅ Pakai average_rating dan total_reviews dari response langsung
            if (data.average_rating) setAverageRating(data.average_rating);
            if (data.total_reviews) setTotalReviews(data.total_reviews);
          }
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
      };

      fetchReviews();
    }, [item?.id]);

    useEffect(() => {
      const fetchBuyerOrderStatus = async () => {
        if (!isAuthenticated || !item?.id || isOwner) return;
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(`${API_URL}/orders/my`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            }
          });
          if (response.ok) {
            const data = await response.json();
            const myOrder = data.find(order => order.market_item_id === item.id);
            if (myOrder) setBuyerOrderStatus(myOrder.status);
          }
        } catch (err) {
          console.error('Error fetching buyer order:', err);
        }
      };

      fetchBuyerOrderStatus();
    }, [item?.id, isAuthenticated, isOwner]);

    const getImageUrl = () => {
      if (!item) return null;
      if (imageError) return null;
      if (item.thumbnail_url) return item.thumbnail_url;
      if (item.thumbnail) {
        if (item.thumbnail.startsWith('http')) return item.thumbnail;
        return `${API_URL.replace('/api', '')}/storage/${item.thumbnail}`;
      }
      return null;
    };

    const formatPrice = (price) => {
      if (!price && price !== 0) return '0';
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };

    const getItemPrice = () => parseFloat(item?.price || 0);
    const getTotalPrice = () => getItemPrice() * quantity;

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    };

    const getLevelColor = (level) => {
      switch (level?.toLowerCase()) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'expert': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const handleBack = () => window.history.back();
    const handleEdit = () => window.location.href = `/edit-item/${item.id}`;

    const handleOrder = () => {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=/details/${item.id}`;
        return;
      }
      setShowMessageForm(true);
    };

    const handleCloseForm = () => {
      setShowMessageForm(false);
    };

    // ✅ Buat order + kirim pesan ke seller sekaligus
    const handleSendMessage = async () => {
      if (!isAuthenticated) {
        window.location.href = `/login?redirect=/details/${item.id}`;
        return;
      }

      if (!message.trim()) {
        alert('Silakan isi pesan Anda');
        return;
      }

      setSendingMessage(true);
      setMessageStatus(null);

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

        // 409 = sudah pernah order, tetap lanjut kirim pesan
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

        if (!messageResponse.ok) {
          throw new Error(messageData.message || 'Gagal mengirim pesan');
        }

        setMessageStatus('success');
        setMessage('');

        setTimeout(() => {
          setShowMessageForm(false);
          setMessageStatus(null);
        }, 3000);

      } catch (err) {
        console.error('Error:', err);
        setMessageStatus('error');
      } finally {
        setSendingMessage(false);
      }
    };

    const handleReviewSubmitted = (newReview) => {
      const newTotal = totalReviews + 1;
      const newAvg = ((averageRating * totalReviews) + newReview.rating) / newTotal;
      setAverageRating(newAvg.toFixed(1));
      setTotalReviews(newTotal);
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-white">
          <Navbar isLoggedIn={isAuthenticated} user={user} />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <Footer />
        </div>
      );
    }

    if (error || !item) {
      return (
        <div className="min-h-screen bg-white">
          <Navbar isLoggedIn={isAuthenticated} user={user} />
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Item Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">{error || 'Item tidak tersedia'}</p>
            <Button
              text="Kembali ke Marketplace"
              variant="solid"
              onClick={() => window.location.href = '/'}
            />
          </div>
          <Footer />
        </div>
      );
    }

    const itemPrice = getItemPrice();
    const totalPrice = getTotalPrice();
    const imageUrl = getImageUrl();

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isAuthenticated} user={user} />

        <div className="max-w-7xl mx-auto px-4 py-3 mt-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali ke Marketplace
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">

            {/* Image */}
            <div className="relative w-full bg-gray-100" style={{ minHeight: '400px' }}>
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '500px' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <ImageOff size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Gambar tidak tersedia</p>
                  </div>
                </div>
              )}

              <span className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
                {item.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">

              {/* Title & Level */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                {item.skill_level && (
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getLevelColor(item.skill_level)}`}>
                    <Clock size={14} className="mr-1" />
                    {item.skill_level}
                  </span>
                )}
              </div>

              {/* Seller Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{item.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">
                        Member sejak {formatDate(item.user?.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Rating dinamis */}
                  <div className="flex items-center gap-1">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {averageRating > 0 ? averageRating : 'Belum ada'}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({totalReviews} ulasan)
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                <div className="flex gap-4">
                  <div className="w-1 bg-indigo-400 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {item.description || 'Tidak ada deskripsi'}
                  </p>
                </div>
              </div>

              {/* What You Get */}
              {item.what_you_get && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Yang Didapat</h2>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-bold whitespace-pre-line">{item.what_you_get}</p>
                  </div>
                </div>
              )}

              {/* Price & Order */}
              <div className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Harga</p>
                    <span className="text-3xl font-bold text-indigo-600">
                      Rp {formatPrice(itemPrice)}
                    </span>
                  </div>

                  {!isOwner && (
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Jumlah:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                          disabled={quantity <= 1}
                        >-</button>
                        <span className="w-12 text-center py-2">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >+</button>
                      </div>
                    </div>
                  )}
                </div>

                {!isOwner && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">Total</span>
                        <p className="text-sm text-gray-500">
                          {quantity} item x Rp {formatPrice(itemPrice)}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-indigo-600">
                        Rp {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {isOwner ? (
                    <Button
                      text="Edit Karya"
                      variant="solid"
                      fullWidth
                      icon={<Pencil size={18} />}
                      onClick={handleEdit}
                    />
                  ) : (
                    <Button
                      text="Pesan Sekarang"
                      variant="solid"
                      fullWidth
                      icon={<ShoppingCart size={18} />}
                      onClick={handleOrder}
                    />
                  )}
                </div>

                {!isOwner && buyerOrderStatus && (
                  <OrderStatusLabel status={buyerOrderStatus} />
                )}

                {!isOwner && showMessageForm && (
                  <MessageForm
                    item={item}
                    user={user}
                    onClose={handleCloseForm}
                    onOrderSuccess={() => setBuyerOrderStatus('pending')}
                  />
                )}
              </div>

              {isOwner && (
                <OrderManagement
                  itemId={item.id}
                  sellerId={item.user_id}
                />
              )}
            </div>
          </div>

          {/* Review Section */}
          <ReviewItem
            itemId={item.id}
            userId={user?.id}
            isAuthenticated={isAuthenticated}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>

        <Footer />
      </div>
    );
  };

  export default DetailsItem;