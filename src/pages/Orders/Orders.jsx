// src/pages/Orders/Orders.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
// import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <LoadingSpinner size="large" text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <motion.div
          className="orders-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">
              Track and manage your orders
            </p>
          </div>

          <div className="orders-stats">
            <div className="stat">
              <Package size={24} />
              <div>
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            className="empty-orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Package size={64} className="empty-icon" />
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here</p>
          </motion.div>
        ) : (
          <motion.div
            className="orders-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Order #{order.id}</h3>
                    <div className="order-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="meta-item">
                        <DollarSign size={14} />
                        <span>${order.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="order-items-preview">
                  <div className="items-grid">
                    {order.items?.slice(0, 3).map((item, itemIndex) => (
                      <div key={itemIndex} className="item-preview">
                        <img
                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'}
                          alt={item.product?.title}
                          className="item-image"
                        />
                        <div className="item-info">
                          <h4 className="item-title">{item.product?.title}</h4>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price">${item.price}</div>
                      </div>
                    ))}

                    {order.items?.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="order-actions">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="view-order-btn"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {order.daftra_invoice_id && (
                      <span className="invoice-badge">
                        Invoice: {order.daftra_invoice_id}
                      </span>
                    )}
                  </div>

                  <div className="order-total">
                    Total: <strong>${order.total_amount}</strong>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <motion.div
            className="order-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              className="order-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header">
                <h2 className="modal-title">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="close-modal"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Order Information */}
              <div className="modal-content">
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Order Number:</span>
                    <strong>#{selectedOrder.id}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Order Date:</span>
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Status:</span>
                    <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  {selectedOrder.daftra_invoice_id && (
                    <div className="summary-row">
                      <span>Invoice ID:</span>
                      <span className="invoice-id">{selectedOrder.daftra_invoice_id}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="order-items-details">
                  <h3 className="section-title">Order Items</h3>
                  <div className="items-list">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.title}
                          className="item-image"
                        />
                        <div className="item-details">
                          <h4 className="item-title">{item.product?.title}</h4>
                          <p className="item-category">{item.product?.category?.name}</p>
                          <p className="item-sku">SKU: {item.product?.sku}</p>
                        </div>
                        <div className="item-quantity-price">
                          <span className="quantity">Qty: {item.quantity}</span>
                          <span className="price">${item.price}</span>
                          <span className="total">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="order-total-summary">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.total_amount}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>${(selectedOrder.total_amount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="total-row final">
                    <span>Total:</span>
                    <span>${(selectedOrder.total_amount * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;