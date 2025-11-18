// src/pages/ProductDetails/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { productsAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productsAPI.getRelated(id);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) console.log('Added to cart successfully');
    else console.error('Failed to add to cart:', result.error);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <LoadingSpinner size="large" text="Loading product details..." />
    </div>
  );

  if (!product) return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-semibold">Product not found</h2>
      <Link to="/products" className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded-lg">Back to Products</Link>
    </div>
  );

  const images = product.images || ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} className="mr-2"/> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <motion.img
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.title}
              className="w-full rounded-xl object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            {images.length > 1 && (
              <div className="flex mt-4 space-x-2">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`border rounded-lg overflow-hidden ${selectedImage === index ? 'border-red-500' : 'border-gray-200'}`}>
                    <img src={img} alt={index} className="w-16 h-16 object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Title & Rating */}
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.rating && (
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={16} className={`fill-current ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-gray-600">{product.rating} • {product.reviewCount || 0} reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && <span className="line-through text-gray-400">${product.originalPrice}</span>}
              {product.discount && <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{product.discount}% OFF</span>}
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <span className={`px-2 py-1 rounded ${product.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">Out of Stock</span>
              )}
            </div>

            {/* Material & Sizes */}
            <div className="flex gap-4 mt-4">
              {product.Material && (
                <div>
                  <span className="font-semibold">Material:</span> {product.Material}
                </div>
              )}
              {product.Sizes && (
                <div>
                  <span className="font-semibold">Sizes:</span> {product.Sizes.join(', ')}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Quantity:</span>
              <button className="border px-2 py-1 rounded" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}><Minus size={14}/></button>
              <span className="px-3">{quantity}</span>
              <button className="border px-2 py-1 rounded" onClick={() => handleQuantityChange(1)} disabled={quantity >= (product.stock || 10)}><Plus size={14}/></button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700" onClick={handleAddToCart} disabled={!product.stock}>Add to Cart</button>
              <button className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300" disabled={!product.stock}>Buy Now</button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-4 mt-2">
              <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'}/>
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Share2 size={20}/> Share
              </button>
            </div>

            {/* Features */}
            <div className="flex gap-4 mt-4 text-gray-600">
              <div className="flex items-center gap-1"><Truck size={20}/> Free shipping over $100</div>
              <div className="flex items-center gap-1"><Shield size={20}/> 2-year warranty</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b">
            {['description', 'specifications', 'reviews', 'shipping'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px ${activeTab === tab ? 'border-b-2 border-red-600 font-semibold text-red-600' : 'text-gray-600 hover:text-gray-900'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'description' && (
              <div>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.Material && (
                  <div><span className="font-semibold">Material:</span> {product.Material}</div>
                )}
                {product.Sizes && (
                  <div><span className="font-semibold">Sizes:</span> {product.Sizes.join(', ')}</div>
                )}
                <div><span className="font-semibold">SKU:</span> {product.sku}</div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>No reviews yet. Be the first to review!</div>
            )}
            {activeTab === 'shipping' && (
              <div>Free standard shipping on orders over $100. 30-day return policy.</div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
