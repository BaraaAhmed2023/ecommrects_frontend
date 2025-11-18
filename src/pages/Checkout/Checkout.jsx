// src/pages/Checkout/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    sameAsShipping: true,
    notes: ''
  });

  const shippingCost = getCartTotal() > 100 ? 0 : 9.99;
  const tax = getCartTotal() * 0.08;
  const finalTotal = getCartTotal() + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await ordersAPI.create();
      setOrderData(response.data);
      setOrderComplete(true);
      await clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <motion.div
          className="bg-white rounded-lg p-8 shadow-lg text-center flex flex-col items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <CheckCircle size={64} className="text-green-500" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Thank you for your purchase. Your order has been received.
          </motion.p>

          {orderData && (
            <motion.div
              className="w-full mt-4 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <strong>#{orderData.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <strong>${orderData.total_amount}</strong>
                </div>
                {orderData.daftra_invoice_id && (
                  <div className="flex justify-between">
                    <span>Invoice ID:</span>
                    <strong>{orderData.daftra_invoice_id}</strong>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow space-y-6">
          <motion.button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </motion.button>
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <motion.section
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-blue-600 font-bold">1</span> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address *"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code *"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </motion.section>

            {/* Payment Information */}
            <motion.section
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-blue-600 font-bold">2</span> Payment Information
              </h2>
              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <CreditCard size={20} />
                <span>Credit Card</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cardName"
                  placeholder="Name on Card *"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number *"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  required
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </motion.section>

            {/* Additional Information */}
            <motion.section
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-blue-600 font-bold">3</span> Additional Information
              </h2>
              <textarea
                name="notes"
                rows="4"
                placeholder="Order Notes (Optional)"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </motion.section>

            {/* Submit */}
            <motion.div
              className="space-y-2 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                type="submit"
                disabled={loading || cartLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Complete Order · ${finalTotal.toFixed(2)}
                  </>
                )}
              </button>
              <p className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield size={16} />
                Your order is secure and encrypted
              </p>
            </motion.div>
          </form>
        </div>

        {/* Order Summary */}
        <motion.div
          className="w-full lg:w-96 bg-white p-6 rounded-lg shadow flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold border-b pb-2">Order Summary</h3>

          <div className="space-y-4 mt-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product?.title}</h4>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">${(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {getCartTotal() < 100 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">
                Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping!
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(getCartTotal() / 100) * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
