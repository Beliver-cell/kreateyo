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

    const { supplierId, productIds, profitMarginPercent = 30 } = await req.json();

    console.log(`Importing products from supplier ${supplierId} for user ${user.id}`);

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

    const importedProducts = [];
    const errors = [];

    // Simulate fetching products from supplier API
    // In production, you would make actual API calls to fetch product details
    for (const productId of productIds) {
      try {
        console.log(`Fetching product ${productId} from ${supplier.platform}...`);
        
        // Mock product data - replace with actual API calls
        const mockProduct = {
          external_id: productId,
          name: `Imported ${supplier.platform} Product ${productId}`,
          description: 'High quality product from supplier',
          cost: 15.99,
          price: 15.99 * (1 + profitMarginPercent / 100),
          profit_margin: profitMarginPercent,
          images: [
            'https://via.placeholder.com/400x400?text=Product+Image'
          ],
          variants: [],
          shipping_time: '10-15 days',
          stock_quantity: 100
        };

        // Insert into imported_products
        const { data: imported, error: importError } = await supabaseClient
          .from('imported_products')
          .insert({
            user_id: user.id,
            supplier_id: supplierId,
            external_id: mockProduct.external_id,
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            compare_at_price: mockProduct.price * 1.2,
            cost: mockProduct.cost,
            profit_margin: mockProduct.profit_margin,
            images: JSON.stringify(mockProduct.images),
            variants: JSON.stringify(mockProduct.variants),
            shipping_time: mockProduct.shipping_time,
            stock_quantity: mockProduct.stock_quantity,
            sync_status: 'synced',
            last_synced_at: new Date().toISOString()
          })
          .select()
          .single();

        if (importError) {
          console.error(`Error importing product ${productId}:`, importError);
          errors.push({ productId, error: importError.message });
        } else {
          importedProducts.push(imported);
        }
      } catch (error) {
        console.error(`Exception importing product ${productId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ productId, error: errorMessage });
      }
    }

    // Log the import
    await supabaseClient
      .from('sync_logs')
      .insert({
        user_id: user.id,
        supplier_id: supplierId,
        sync_type: 'products',
        status: errors.length === 0 ? 'success' : errors.length < productIds.length ? 'partial' : 'failed',
        items_processed: importedProducts.length,
        items_failed: errors.length,
        error_details: errors.length > 0 ? JSON.stringify(errors) : null
      });

    // Update supplier last sync
    await supabaseClient
      .from('suppliers')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', supplierId);

    return new Response(
      JSON.stringify({ 
        success: true,
        imported: importedProducts.length,
        failed: errors.length,
        products: importedProducts,
        errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import products error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
