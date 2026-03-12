import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, AlertCircle, MessageSquare, User } from 'lucide-react';
import Button from '../Components/Button';

const ReviewItem = ({ itemId, userId, isAuthenticated, onReviewSubmitted }) => {
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  const API_URL = 'http://api.skillnest.site/api';

  // Cek eligibility review
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!isAuthenticated || !userId) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders/check-item/${itemId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCanReview(data.canReview);
          setAlreadyReviewed(data.alreadyReviewed);
        }
      } catch (err) {
        console.error('Error checking review eligibility:', err);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkReviewEligibility();
  }, [itemId, userId, isAuthenticated]);

  // Fetch semua reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/items/${itemId}/reviews`);

        if (response.ok) {
          const data = await response.json();
          const reviews = data.data || [];
          setAllReviews(reviews);

          if (userId) {
            const myReview = reviews.find(review => review.reviewer_id === userId);
            setUserReview(myReview || null);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Gagal memuat ulasan');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchReviews();
  }, [itemId, userId]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/details/${itemId}`;
      return;
    }

    if (selectedRating === 0) {
      alert('Silakan pilih rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/reviews/${itemId}`, { // ✅ fix: /reviews/ bukan /review/
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: selectedRating,
          comment: comment.trim() || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim ulasan');
      }

      const newReview = {
        ...data.data,
        reviewer: {
          id: userId,
          name: JSON.parse(localStorage.getItem('user')).name
        }
      };

      setUserReview(newReview);
      setAllReviews(prev => [newReview, ...prev]);
      setCanReview(false);
      setAlreadyReviewed(true);
      setShowReviewForm(false);
      setSelectedRating(0);
      setComment('');

      if (onReviewSubmitted) onReviewSubmitted(newReview);

    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: allReviews.filter(r => r.rating === star).length,
    percentage: allReviews.length > 0
      ? (allReviews.filter(r => r.rating === star).length / allReviews.length) * 100
      : 0
  }));

  const getRatingLabel = (rating) => {
    const labels = { 1: 'Sangat Buruk', 2: 'Buruk', 3: 'Cukup', 4: 'Bagus', 5: 'Sangat Bagus' };
    return labels[rating] || '';
  };

  if (loading || checkingEligibility) {
    return (
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-indigo-600" />
          Ulasan Pembeli
        </h2>

        {/* Ringkasan Rating */}
        {allReviews.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
              <div className="flex items-center justify-center md:justify-start mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{allReviews.length} ulasan</p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{star} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sudah review */}
        {alreadyReviewed && !userReview && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            Anda sudah memberikan ulasan untuk item ini.
          </div>
        )}

        {/* Tombol Tulis Ulasan */}
        {canReview && !userReview && (
          <div className="mb-6">
            {!showReviewForm ? (
              <Button
                text="Tulis Ulasan"
                variant="outline"
                onClick={() => setShowReviewForm(true)}
                icon={<Star size={16} />}
              />
            ) : (
              <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                <h3 className="font-semibold text-gray-800 mb-4">Beri Ulasan untuk Item Ini</h3>

                {/* Rating Stars */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={`cursor-pointer transition-colors ${
                            (hoverRating || selectedRating) >= star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {(hoverRating || selectedRating) > 0 && (
                      <span className="ml-2 text-sm font-medium text-indigo-600">
                        {getRatingLabel(hoverRating || selectedRating)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Komentar <span className="text-gray-400">(opsional)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bagikan pengalaman Anda menggunakan item ini..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-3 p-2 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-1">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    text={submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                    variant="solid"
                    onClick={handleSubmitReview}
                    disabled={submitting || selectedRating === 0}
                  />
                  <Button
                    text="Batal"
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setSelectedRating(0);
                      setComment('');
                      setError(null);
                    }}
                    disabled={submitting}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daftar Semua Ulasan */}
        {allReviews.length > 0 ? (
          <div className="space-y-4 divide-y divide-gray-100">
            {allReviews.map((review, index) => (
              <div key={index} className="pt-4 first:pt-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {review.reviewer?.name ? (
                        <span className="text-sm font-semibold text-indigo-600">
                          {review.reviewer.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User size={16} className="text-indigo-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm text-gray-800">
                        {review.reviewer?.name || 'Pengguna'}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(review.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {review.comment && (
                  <div className="ml-12 mt-2">
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
                      {review.comment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Star size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium text-gray-400">Belum ada ulasan untuk item ini</p>
            {canReview && !userReview && (
              <p className="text-sm mt-1 text-gray-400">Jadilah yang pertama memberi ulasan!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;