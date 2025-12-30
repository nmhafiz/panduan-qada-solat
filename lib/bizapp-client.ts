/**
 * ================================================
 * BIZAPP HQ API CLIENT - DENO/SUPABASE EDGE FUNCTION VERSION
 * ================================================
 * 
 * Version: 1.0.0
 * Last Updated: 2025-12-30
 * 
 * HOW TO USE IN SUPABASE EDGE FUNCTION:
 * 1. Copy this file to your supabase/functions/shared/ folder
 * 2. Import in your edge function:
 *    import { submitToBizapp } from '../shared/bizapp-client.ts';
 * 3. Call with your order data
 */

// ================================================
// TYPE DEFINITIONS
// ================================================

interface BizappConfig {
    secretKey: string;
    currency: 'MYR' | 'SGD' | 'USD' | 'BND' | 'IDR';
    websiteUrl: string;
    shippingMethod?: string;
}

interface Product {
    sku: string;
    quantity: number;
}

interface OrderParams {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    totalPrice: number;
    postagePrice: number;
    products: Product[];
    paymentGateway: 'Online Banking' | 'Cash On Delivery (COD)';
    orderNotes?: string;
    billId?: string;
    paymentUrl?: string;
}

interface BizappResult {
    success: boolean;
    orderId?: string;
    dateSubmitted?: string;
    error?: string;
}

// ================================================
// CONSTANTS
// ================================================

const CURRENCY_SUFFIXES: Record<string, string> = {
    'MYR': '-MY',
    'SGD': '-SG',
    'USD': '-US',
    'BND': '-BN',
    'IDR': '-ID'
};

const API_ENDPOINT = 'https://woo.bizapp.my/v2/wooapi.php';
const API_METHOD = 'WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU';

// ================================================
// HELPER FUNCTIONS
// ================================================

function generateOrderId(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    return (timestamp + randomSuffix).slice(-7);
}

function getSecretKey(baseKey: string, currency: string): string {
    const suffix = CURRENCY_SUFFIXES[currency] || '-MY';
    return baseKey.endsWith(suffix) ? baseKey : baseKey + suffix;
}

// ================================================
// MAIN EXPORT FUNCTION
// ================================================

export async function submitToBizapp(
    config: BizappConfig,
    params: OrderParams
): Promise<BizappResult> {
    try {
        const wooOrderId = generateOrderId();
        const secretKey = getSecretKey(config.secretKey, config.currency);

        // Payment gateway settings
        const isOnlineBanking = params.paymentGateway === 'Online Banking';
        const wooPaymentGatewayId = isOnlineBanking ? 'online_banking' : 'cod';
        const setPaid = isOnlineBanking ? 'true' : 'false';

        // Build note with payment link
        const noteParts = [params.orderNotes || 'Order'];
        if (params.paymentUrl) noteParts.push(`Payment Link: ${params.paymentUrl}`);
        if (params.billId) noteParts.push(`Ref: ${params.billId}`);
        const note = noteParts.join(' | ');

        // Build form data
        const formData = new URLSearchParams();

        // Customer Info
        formData.append('name', params.customerName);
        formData.append('email', params.customerEmail);
        formData.append('hpno', params.customerPhone);  // ⚠️ CORRECT FIELD NAME
        formData.append('address', params.customerAddress);

        // Pricing
        formData.append('sellingprice', params.totalPrice.toString());
        formData.append('postageprice', params.postagePrice.toString());
        formData.append('note', note);

        // WooCommerce Fields
        formData.append('woo_url', config.websiteUrl);
        formData.append('woo_orderid', wooOrderId);
        formData.append('woo_paymentgateway', params.paymentGateway);
        formData.append('woo_paymentgateway_id', wooPaymentGatewayId);
        formData.append('woo_payment_txn', params.billId || '');
        formData.append('woo_shipping_method', config.shippingMethod || 'Pos Laju');

        // Status
        formData.append('currency', config.currency);
        formData.append('status', 'processing');
        formData.append('set_paid', setPaid);

        // Products
        params.products.forEach((product, index) => {
            formData.append(`products_info[${index}][sku]`, product.sku.toUpperCase());
            formData.append(`products_info[${index}][quantity]`, product.quantity.toString());
        });

        // Build URL
        const url = `${API_ENDPOINT}?api_name=${API_METHOD}&secretkey=${encodeURIComponent(secretKey)}`;

        console.log(`Sending to Bizapp: ${url.split('?')[0]} (ID: ${wooOrderId})`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);

            if (data.status === 'success' && data.result?.[0]?.ID) {
                console.log(`✅ Bizapp Order Submitted! ID: ${data.result[0].ID}`);
                return {
                    success: true,
                    orderId: data.result[0].ID,
                    dateSubmitted: data.result[0].datesubmitted
                };
            } else {
                console.error('Bizapp API Error:', data.error_message || data);
                return { success: false, error: data.error_message || 'Unknown error' };
            }
        } catch {
            console.error('Bizapp Response not JSON:', text);
            return { success: false, error: `Invalid response: ${text.substring(0, 100)}` };
        }

    } catch (err) {
        console.error('Bizapp Sync Failed:', err);
        return { success: false, error: String(err) };
    }
}

// ================================================
// USAGE EXAMPLE IN EDGE FUNCTION:
// ================================================
/*
import { submitToBizapp } from '../shared/bizapp-client.ts';

// In your handler:
const result = await submitToBizapp(
    {
        secretKey: Deno.env.get("BIZAPP_API_TOKEN") ?? "",
        currency: 'MYR',
        websiteUrl: 'https://yoursite.com',
        shippingMethod: 'Pos Laju'
    },
    {
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: fullAddress,
        totalPrice: order.amount,
        postagePrice: 0,
        products: [{ sku: 'YOUR_SKU', quantity: qty }],
        paymentGateway: 'Online Banking',
        orderNotes: 'Order description',
        billId: order.bill_id,
        paymentUrl: `https://bizappay.my/${order.bill_id}`
    }
);

if (result.success) {
    console.log('Bizapp Order ID:', result.orderId);
}
*/
