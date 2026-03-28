import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ProductWithLatestPrice } from '../types/database';

interface PriceCardProps {
  product: ProductWithLatestPrice;
  onClick: () => void;
}

export function PriceCard({ product, onClick }: PriceCardProps) {
  const priceChange = product.price_change || 0;
  const isIncrease = priceChange > 0;
  const isDecrease = priceChange < 0;
  const isStable = priceChange === 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        {isIncrease && (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{priceChange.toFixed(2)}%</span>
          </div>
        )}
        {isDecrease && (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{priceChange.toFixed(2)}%</span>
          </div>
        )}
        {isStable && (
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
            <Minus className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">0%</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-bold text-gray-900">
            ₱{product.latest_price?.toFixed(2) || '—'}
          </span>
          <span className="text-sm text-gray-500 ml-2">{product.unit}</span>
        </div>
      </div>

      {product.recorded_at && (
        <p className="text-xs text-gray-400 mt-3">
          Updated: {new Date(product.recorded_at).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}
