import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Printer, Trash2 } from 'lucide-react';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const Orders = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shopSettings, setShopSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchShopSettings();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    setProducts(data || []);
    setLoading(false);
  };

  const fetchShopSettings = async () => {
    const { data } = await supabase
      .from('shop_settings')
      .select('*')
      .single();
    
    setShopSettings(data);
  };

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setOrderItems(
      orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = 0; // Can be configured
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const clearOrder = () => {
    setOrderItems([]);
    toast.success(t('orders.clear'));
  };

  const printReceipt = async () => {
    if (orderItems.length === 0) {
      toast.error(t('orders.empty'));
      return;
    }

    // Save order to database
    const totals = calculateTotals();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        staff_id: user?.id,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error('Error creating order');
      return;
    }

    // Save order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        orderItems.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
        }))
      );

    if (itemsError) {
      toast.error('Error saving order items');
      return;
    }

    // Generate and print receipt
    generatePrintReceipt(totals);
    clearOrder();
    toast.success('Order completed!');
  };

  const generatePrintReceipt = (totals: { subtotal: number; tax: number; total: number }) => {
    const receiptWindow = window.open('', '', 'width=300,height=600');
    if (!receiptWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              width: 280px;
              margin: 0;
              padding: 10px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              font-weight: bold;
            }
            .line {
              border-bottom: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .totals {
              margin-top: 10px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>${shopSettings?.shop_name || 'Boutique del Gelato'}</div>
            ${shopSettings?.address ? `<div>${shopSettings.address}</div>` : ''}
            ${shopSettings?.phone ? `<div>${shopSettings.phone}</div>` : ''}
            <div>${new Date().toLocaleString()}</div>
          </div>
          <div class="line"></div>
          ${orderItems.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.productName}</span>
              <span>$${item.subtotal.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <div class="totals">
            <div class="item">
              <span>${t('orders.subtotal')}</span>
              <span>$${totals.subtotal.toFixed(2)}</span>
            </div>
            ${totals.tax > 0 ? `
              <div class="item">
                <span>${t('orders.tax')}</span>
                <span>$${totals.tax.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="item">
              <span>${t('orders.total')}</span>
              <span>$${totals.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="footer">
            ${t('common.thankYou')}
          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
    
    setTimeout(() => {
      receiptWindow.print();
      receiptWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">{t('common.loading')}</div>
      </Layout>
    );
  }

  const totals = calculateTotals();

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">{t('orders.title')}</h2>
          
          {products.length === 0 ? (
            <Card className="card-shadow">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No products available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(product => (
                <Card
                  key={product.id}
                  className="card-shadow card-hover cursor-pointer"
                  onClick={() => addToOrder(product)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">{product.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
                      <div className="text-xl font-bold text-primary">${product.price.toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="card-shadow sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Order</span>
                {orderItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOrder}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('orders.empty')}</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {orderItems.map(item => (
                      <div key={item.productId} className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.unitPrice.toFixed(2)} each
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            min="0"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="font-bold w-20 text-right">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{t('orders.subtotal')}</span>
                      <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.tax > 0 && (
                      <div className="flex justify-between">
                        <span>{t('orders.tax')}</span>
                        <span className="font-semibold">${totals.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>{t('orders.total')}</span>
                      <span className="text-primary">${totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={printReceipt}
                    className="w-full touch-target"
                    size="lg"
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    {t('orders.print')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
