import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PriceUpdate {
  product_id: string;
  price: number;
  source?: string;
  location?: string;
  recorded_at?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === "POST") {
      const body = await req.json();
      const updates: PriceUpdate[] = Array.isArray(body) ? body : [body];

      const results = [];

      for (const update of updates) {
        const { product_id, price, source, location, recorded_at } = update;

        if (!product_id || price === undefined) {
          results.push({
            success: false,
            error: "Missing required fields: product_id and price",
          });
          continue;
        }

        const { data, error } = await supabase
          .from("price_history")
          .insert({
            product_id,
            price,
            source: source || "Manual Entry",
            location: location || "National Capital Region",
            recorded_at: recorded_at || new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          results.push({
            success: false,
            product_id,
            error: error.message,
          });
        } else {
          results.push({
            success: true,
            product_id,
            data,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          results,
          total: updates.length,
          successful: results.filter((r) => r.success).length,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (req.method === "GET") {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          success: true,
          products,
          message: "Use POST method to update prices",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Method not allowed. Use GET to list products or POST to update prices.",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
