import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { supplierId } = await req.json();

    console.log(`Syncing inventory for supplier ${supplierId}`);

    // Get supplier details
    const { data: supplier, error: supplierError } = await supabaseClient
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .eq('user_id', user.id)
      .single();

    if (supplierError || !supplier) {
      return new Response(JSON.stringify({ error: 'Supplier not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all imported products for this supplier
    const { data: products, error: productsError } = await supabaseClient
      .from('imported_products')
      .select('*')
      .eq('supplier_id', supplierId)
      .eq('user_id', user.id);

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let updatedCount = 0;
    let errorCount = 0;

    // Sync each product's inventory
    for (const product of products) {
      try {
        console.log(`Syncing inventory for product ${product.external_id}...`);
        
        // Mock API call to get current stock - replace with actual supplier API
        const mockStockData = {
          stock_quantity: Math.floor(Math.random() * 500) + 50,
          price: product.cost * (Math.random() * 0.2 + 0.9) // Simulate price fluctuation
        };

        // Update product stock and price
        const { error: updateError } = await supabaseClient
          .from('imported_products')
          .update({
            stock_quantity: mockStockData.stock_quantity,
            cost: mockStockData.price,
            price: mockStockData.price * (1 + product.profit_margin / 100),
            last_synced_at: new Date().toISOString(),
            sync_status: 'synced'
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
          errorCount++;
        } else {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Exception syncing product ${product.id}:`, error);
        errorCount++;
      }
    }

    // Update supplier last sync time
    await supabaseClient
      .from('suppliers')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', supplierId);

    // Log the sync
    await supabaseClient
      .from('sync_logs')
      .insert({
        user_id: user.id,
        supplier_id: supplierId,
        sync_type: 'inventory',
        status: errorCount === 0 ? 'success' : errorCount < products.length ? 'partial' : 'failed',
        items_processed: updatedCount,
        items_failed: errorCount
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        synced: updatedCount,
        failed: errorCount,
        total: products.length,
        message: `Inventory sync completed. ${updatedCount} products updated.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync inventory error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
