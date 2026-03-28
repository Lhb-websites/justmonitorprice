import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, PriceHistory } from '../types/database';

interface PriceModalProps {
  product: Product;
  onClose: () => void;
}

export function PriceModal({ product, onClose }: PriceModalProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriceHistory();
  }, [product.id]);

  async function loadPriceHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', product.id)
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      setPriceHistory(data);
    }
    setLoading(false);
  }

  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-600">{product.category} • {product.unit}</p>
            {product.description && (
              <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading price history...</p>
            </div>
          ) : priceHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No price history available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Current Price</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₱{priceHistory[0].price.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Lowest (30 days)
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    ₱{minPrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Highest (30 days)
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    ₱{maxPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price History</h3>
                {priceHistory.map((history, index) => {
                  const prevPrice = priceHistory[index + 1]?.price;
                  const priceChange = prevPrice ? ((history.price - prevPrice) / prevPrice) * 100 : 0;

                  return (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">₱{history.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{history.location}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(history.recorded_at).toLocaleDateString('en-PH', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        {prevPrice && (
                          <div
                            className={`text-sm font-medium ${
                              priceChange > 0
                                ? 'text-red-600'
                                : priceChange < 0
                                ? 'text-green-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {priceChange > 0 ? '+' : ''}
                            {priceChange.toFixed(2)}%
                          </div>
                        )}
                        <p className="text-xs text-gray-500">{history.source}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
