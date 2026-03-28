export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          unit: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          unit: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          unit?: string;
          description?: string;
          created_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          product_id: string;
          price: number;
          source: string;
          location: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          price: number;
          source?: string;
          location?: string;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          price?: number;
          source?: string;
          location?: string;
          recorded_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type PriceHistory = Database['public']['Tables']['price_history']['Row'];

export interface ProductWithLatestPrice extends Product {
  latest_price: number | null;
  price_change: number | null;
  recorded_at: string | null;
}
