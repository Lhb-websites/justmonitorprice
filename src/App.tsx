import { useEffect, useState } from 'react';
import { ShoppingBasket, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from './lib/supabase';
import { PriceCard } from './components/PriceCard';
import { PriceModal } from './components/PriceModal';
import type { Product, ProductWithLatestPrice } from './types/database';

function App() {
  const [products, setProducts] = useState<ProductWithLatestPrice[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (productsError || !productsData) {
      setLoading(false);
      return;
    }

    const productsWithPrices: ProductWithLatestPrice[] = [];

    for (const product of productsData) {
      const { data: latestPrice } = await supabase
        .from('price_history')
        .select('*')
        .eq('product_id', product.id)
        .order('recorded_at', { ascending: false })
        .limit(2);

      const latest = latestPrice?.[0];
      const previous = latestPrice?.[1];

      const priceChange = latest && previous
        ? ((latest.price - previous.price) / previous.price) * 100
        : 0;

      productsWithPrices.push({
        ...product,
        latest_price: latest?.price || null,
        price_change: priceChange,
        recorded_at: latest?.recorded_at || null,
      });
    }

    setProducts(productsWithPrices);
    setLastUpdated(new Date());
    setLoading(false);
  }

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const averageChange =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.price_change || 0), 0) / products.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <ShoppingBasket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Philippine Price Monitor
                </h1>
                <p className="text-gray-600">
                  Track essential product prices across the Philippines
                </p>
              </div>
            </div>
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Products Monitored</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Average Price Change</p>
              <div className="flex items-baseline">
                <p
                  className={`text-3xl font-bold ${
                    averageChange > 0
                      ? 'text-red-600'
                      : averageChange < 0
                      ? 'text-green-600'
                      : 'text-gray-900'
                  }`}
                >
                  {averageChange > 0 ? '+' : ''}
                  {averageChange.toFixed(2)}%
                </p>
                {averageChange !== 0 && (
                  <TrendingUp
                    className={`w-6 h-6 ml-2 ${
                      averageChange > 0 ? 'text-red-600' : 'text-green-600 rotate-180'
                    }`}
                  />
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
              <p className="text-xl font-bold text-gray-900">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString('en-PH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading price data...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <PriceCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <PriceModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;
