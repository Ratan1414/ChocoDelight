import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getProducts, getCategories } from '../services/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // Update URL params
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== '' && !(key === 'page' && val === 1) && !(key === 'sort' && val === 'newest')) {
        params[key] = val;
      }
    });
    setSearchParams(params, { replace: true });
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 12;

      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '', category: '', sort: 'newest',
      minPrice: '', maxPrice: '', rating: '', page: 1
    });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-chocolate-700 to-chocolate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Shop Chocolates</h1>
          <p className="text-chocolate-200 mt-2">Discover our complete collection of handcrafted chocolates</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-300" size={20} />
            <input
              type="text"
              placeholder="Search chocolates..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer min-w-[200px]"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-400 pointer-events-none" />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-outline flex items-center justify-center space-x-2"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} lg:block lg:relative lg:bg-transparent lg:z-auto`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto' : ''} lg:w-64 lg:flex-shrink-0 space-y-6`}>
              {showFilters && (
                <div className="flex justify-between items-center lg:hidden mb-4">
                  <h3 className="font-display font-bold text-xl text-chocolate-700">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <FiX size={24} className="text-chocolate-500" />
                  </button>
                </div>
              )}

              {/* Categories */}
              <div className="glass-card p-5">
                <h3 className="font-display font-semibold text-chocolate-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!filters.category ? 'bg-chocolate-500 text-white font-semibold' : 'text-chocolate-500 hover:bg-chocolate-50'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === cat ? 'bg-chocolate-500 text-white font-semibold' : 'text-chocolate-500 hover:bg-chocolate-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="glass-card p-5">
                <h3 className="font-display font-semibold text-chocolate-700 mb-3">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="input-field text-sm py-2"
                    min="0"
                  />
                  <span className="text-chocolate-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="input-field text-sm py-2"
                    min="0"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="glass-card p-5">
                <h3 className="font-display font-semibold text-chocolate-700 mb-3">Min Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(r => (
                    <button
                      key={r}
                      onClick={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.rating === String(r) ? 'bg-gold-100 text-gold-700 font-semibold' : 'text-chocolate-500 hover:bg-chocolate-50'}`}
                    >
                      <span>{'⭐'.repeat(r)}</span>
                      <span>& up</span>
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="w-full btn-outline text-sm py-2 flex items-center justify-center space-x-1">
                  <FiX size={16} />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-chocolate-400 text-sm">
                Showing <span className="font-semibold text-chocolate-700">{products.length}</span> of{' '}
                <span className="font-semibold text-chocolate-700">{total}</span> products
              </p>
            </div>

            {loading ? (
              <LoadingSkeleton type="product-grid" count={6} />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-display font-semibold text-chocolate-600 mb-2">No chocolates found</h3>
                <p className="text-chocolate-400 mb-4">Try adjusting your search or filter criteria</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center space-x-2 mt-10">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all ${filters.page === i + 1 ? 'bg-chocolate-500 text-white shadow-md' : 'bg-white text-chocolate-500 hover:bg-chocolate-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
