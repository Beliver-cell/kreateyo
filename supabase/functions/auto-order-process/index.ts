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

    const { customerOrderId, importedProductId, quantity, shippingAddress } = await req.json();

    console.log(`Processing auto-order for customer order ${customerOrderId}`);

    // Get imported product details
    const { data: product, error: productError } = await supabaseClient
      .from('imported_products')
      .select('*, suppliers(*)')
      .eq('id', importedProductId)
      .eq('user_id', user.id)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supplier = product.suppliers;
    const totalCost = product.cost * quantity;

    // Create supplier order record
    const { data: supplierOrder, error: orderError } = await supabaseClient
      .from('supplier_orders')
      .insert({
        user_id: user.id,
        supplier_id: supplier.id,
        customer_order_id: customerOrderId,
        imported_product_id: importedProductId,
        status: 'processing',
        total_cost: totalCost,
        order_details: JSON.stringify({
          quantity,
          shipping_address: shippingAddress,
          product_name: product.name,
          external_product_id: product.external_id
        })
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating supplier order:', orderError);
      return new Response(JSON.stringify({ error: orderError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate placing order with supplier API
    try {
      console.log(`Placing order with ${supplier.platform} for product ${product.external_id}...`);
      
      // Mock API call - replace with actual supplier API integration
      const mockApiResponse = {
        external_order_id: `EXT-${Date.now()}`,
        status: 'processing',
        tracking_number: null,
        estimated_delivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Update supplier order with external order ID
      await supabaseClient
        .from('supplier_orders')
        .update({
          external_order_id: mockApiResponse.external_order_id,
          status: 'processing'
        })
        .eq('id', supplierOrder.id);

      // Log the order
      await supabaseClient
        .from('sync_logs')
        .insert({
          user_id: user.id,
          supplier_id: supplier.id,
          sync_type: 'orders',
          status: 'success',
          items_processed: 1
        });

      return new Response(
        JSON.stringify({ 
          success: true,
          supplierOrder: {
            ...supplierOrder,
            external_order_id: mockApiResponse.external_order_id
          },
          message: 'Order placed successfully with supplier'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('Supplier API error:', apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
      
      // Update order status to failed
      await supabaseClient
        .from('supplier_orders')
        .update({
          status: 'failed',
          error_message: errorMessage
        })
        .eq('id', supplierOrder.id);

      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to place order with supplier',
          details: errorMessage
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Auto-order process error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
