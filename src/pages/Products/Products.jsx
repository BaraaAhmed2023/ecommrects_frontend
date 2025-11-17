// src/pages/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, ChevronDown, X, Search } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { productsAPI, categoriesAPI } from '../../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    priceRange: [0, 1000],
    inStock: false
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    setSearchParams(params);
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category_id: searchParams.get('category'),
        sort: searchParams.get('sort')
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      sort: 'newest',
      priceRange: [0, 1000],
      inStock: false
    });
    setSearchParams({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.sort !== 'newest') count++;
    if (filters.inStock) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop All Products</h1>
            <p className="text-gray-600 text-lg">
              Discover our curated collection of premium fashion items
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                className={`p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : ''
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : ''
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 relative"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-8"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowFilters(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                    <div className="space-y-2">
                      <button
                        className={`block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                          !filters.category ? 'bg-red-50 text-red-700 font-medium' : ''
                        }`}
                        onClick={() => handleFilterChange('category', '')}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          className={`block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                            filters.category === category.id.toString() ? 'bg-red-50 text-red-700 font-medium' : ''
                          }`}
                          onClick={() => handleFilterChange('category', category.id.toString())}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Price Range</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="sr-only"
                      />
                      <span className="w-5 h-5 border border-gray-300 rounded bg-white flex items-center justify-center mt-0.5 flex-shrink-0">
                        {filters.inStock && (
                          <span className="text-red-600 text-sm">✓</span>
                        )}
                      </span>
                      <span>In Stock Only</span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <button
                    className="w-full py-3 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Main Content */}
          <div className={`flex-1 ${viewMode === 'list' ? 'max-w-full' : ''}`}>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <LoadingSpinner size="large" text="Loading products..." />
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-600">
                    Showing <strong>{products.length}</strong> products
                    {filters.category && (
                      <> in <strong>{categories.find(c => c.id.toString() === filters.category)?.name}</strong></>
                    )}
                  </p>
                </div>

                {/* Products Grid */}
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === 'list'
                      ? 'grid-cols-1'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}
                  layout
                >
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {products.length === 0 && !loading && (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;