/**
 * ================================================
 * BIZAPP HQ API CLIENT - REUSABLE MODULE
 * ================================================
 * 
 * Version: 1.0.0
 * Last Updated: 2025-12-30
 * Author: Based on reverse-engineered n8n-nodes-bizapp
 * 
 * HOW TO USE:
 * 1. Copy this file to your project
 * 2. Set your SECRET_KEY (get from Bizapp HQ dashboard)
 * 3. Set your WEBSITE_URL
 * 4. Import and call submitOrder()
 * 
 * EXAMPLE:
 * ```javascript
 * const { submitOrder } = require('./bizapp-client');
 * 
 * const result = await submitOrder({
 *     customerName: 'Ahmad bin Ali',
 *     customerEmail: 'ahmad@email.com',
 *     customerPhone: '60123456789',
 *     customerAddress: 'No. 1, Jalan ABC, 40000 Shah Alam, Selangor',
 *     totalPrice: 69,
 *     postagePrice: 0,
 *     products: [{ sku: 'PRODUCTSKU', quantity: 3 }],
 *     paymentGateway: 'Online Banking', // or 'Cash On Delivery (COD)'
 *     orderNotes: 'Order notes here'
 * });
 * ```
 */

// ================================================
// CONFIGURATION - EDIT THESE FOR YOUR PROJECT
// ================================================

const CONFIG = {
    // Your Bizapp Secret Key (from HQ Dashboard > Settings)
    SECRET_KEY: '-68f34ff8fe24ad6367ad6ec5d4ec1ddc',

    // Currency: MYR, SGD, USD, BND, IDR
    CURRENCY: 'MYR',

    // Your website URL (appears in Bizapp dashboard)
    WEBSITE_URL: 'https://qadasolat.my',

    // Default shipping method
    SHIPPING_METHOD: 'Pos Laju'
};

// ================================================
// DO NOT EDIT BELOW - BIZAPP API LOGIC
// ================================================

const CURRENCY_SUFFIXES = {
    'MYR': '-MY',
    'SGD': '-SG',
    'USD': '-US',
    'BND': '-BN',
    'IDR': '-ID'
};

const API_ENDPOINT = 'https://woo.bizapp.my/v2/wooapi.php';
const API_METHOD = 'WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU';

/**
 * Generate 7-character Order ID (Bizapp requirement)
 */
function generateOrderId() {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    return (timestamp + randomSuffix).slice(-7);
}

/**
 * Get secret key with currency suffix
 */
function getSecretKey() {
    const suffix = CURRENCY_SUFFIXES[CONFIG.CURRENCY] || '-MY';
    const key = CONFIG.SECRET_KEY.endsWith(suffix)
        ? CONFIG.SECRET_KEY
        : CONFIG.SECRET_KEY + suffix;
    return key;
}

/**
 * Submit order to Bizapp HQ
 * 
 * @param {Object} params - Order parameters
 * @param {string} params.customerName - Customer full name
 * @param {string} params.customerEmail - Customer email
 * @param {string} params.customerPhone - Customer phone (format: 60xxxxxxxxx)
 * @param {string} params.customerAddress - Full address with postcode and state
 * @param {number} params.totalPrice - Total selling price
 * @param {number} params.postagePrice - Shipping cost (0 for free shipping)
 * @param {Array<{sku: string, quantity: number}>} params.products - Products array
 * @param {string} params.paymentGateway - 'Online Banking' or 'Cash On Delivery (COD)'
 * @param {string} [params.orderNotes] - Optional order notes
 * @param {string} [params.billId] - Optional payment bill ID for reference
 * @param {string} [params.paymentUrl] - Optional payment URL to include in notes
 * 
 * @returns {Promise<{success: boolean, orderId?: string, error?: string}>}
 */
async function submitOrder(params) {
    try {
        const wooOrderId = generateOrderId();
        const secretKey = getSecretKey();

        // Determine payment gateway settings
        const isOnlineBanking = params.paymentGateway === 'Online Banking';
        const wooPaymentGatewayId = isOnlineBanking ? 'online_banking' : 'cod';
        const setPaid = isOnlineBanking ? 'true' : 'false';

        // Build note with payment link if provided
        const noteParts = [params.orderNotes || 'Order'];
        if (params.paymentUrl) {
            noteParts.push(`Payment Link: ${params.paymentUrl}`);
        }
        if (params.billId) {
            noteParts.push(`Ref: ${params.billId}`);
        }
        const note = noteParts.join(' | ');

        // Build form data with CORRECT field mappings
        const formData = new URLSearchParams();

        // Customer Info
        formData.append('name', params.customerName);
        formData.append('email', params.customerEmail);
        formData.append('hpno', params.customerPhone);  // ⚠️ FIELD NAME IS 'hpno' NOT 'phone'
        formData.append('address', params.customerAddress);

        // Pricing
        formData.append('sellingprice', params.totalPrice.toString());
        formData.append('postageprice', params.postagePrice.toString());

        // Order Notes
        formData.append('note', note);

        // WooCommerce Integration Fields
        formData.append('woo_url', CONFIG.WEBSITE_URL);
        formData.append('woo_orderid', wooOrderId);
        formData.append('woo_paymentgateway', params.paymentGateway);
        formData.append('woo_paymentgateway_id', wooPaymentGatewayId);
        formData.append('woo_payment_txn', params.billId || '');
        formData.append('woo_shipping_method', CONFIG.SHIPPING_METHOD);

        // Status
        formData.append('currency', CONFIG.CURRENCY);
        formData.append('status', 'processing');
        formData.append('set_paid', setPaid);

        // Products - ⚠️ FORMAT IS products_info[index][sku] and products_info[index][quantity]
        params.products.forEach((product, index) => {
            formData.append(`products_info[${index}][sku]`, product.sku.toUpperCase());
            formData.append(`products_info[${index}][quantity]`, product.quantity.toString());
        });

        // Build URL with encoded secret key
        const url = `${API_ENDPOINT}?api_name=${API_METHOD}&secretkey=${encodeURIComponent(secretKey)}`;

        console.log(`📦 Submitting order to Bizapp (ID: ${wooOrderId})...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);

            if (data.status === 'success' && data.result?.[0]?.ID) {
                console.log(`✅ Bizapp Order Success! ID: ${data.result[0].ID}`);
                return {
                    success: true,
                    orderId: data.result[0].ID,
                    dateSubmitted: data.result[0].datesubmitted
                };
            } else {
                console.error(`❌ Bizapp Error:`, data.error_message || data);
                return {
                    success: false,
                    error: data.error_message || 'Unknown error'
                };
            }
        } catch {
            console.error(`❌ Invalid JSON response:`, text);
            return {
                success: false,
                error: `Invalid response: ${text.substring(0, 100)}`
            };
        }

    } catch (error) {
        console.error(`🔥 Bizapp Submit Error:`, error);
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
    submitOrder,
    CONFIG,
    generateOrderId,
    getSecretKey
};

// ================================================
// FIELD MAPPING REFERENCE (for documentation)
// ================================================
/**
 * BIZAPP API FIELD MAPPING:
 * 
 * | Bizapp Field         | Your Data            | Notes                        |
 * |---------------------|----------------------|------------------------------|
 * | name                | customerName         | Full name                    |
 * | email               | customerEmail        | Email address                |
 * | hpno                | customerPhone        | ⚠️ NOT 'phone' or 'contact' |
 * | address             | customerAddress      | Full address with postcode   |
 * | sellingprice        | totalPrice           | Total amount                 |
 * | postageprice        | postagePrice         | Shipping cost                |
 * | note                | orderNotes           | Can include payment link     |
 * | woo_url             | CONFIG.WEBSITE_URL   | Your website URL             |
 * | woo_orderid         | generated            | 7-char unique ID             |
 * | woo_paymentgateway  | paymentGateway       | 'Online Banking' or 'COD'   |
 * | woo_paymentgateway_id| derived             | 'online_banking' or 'cod'   |
 * | woo_payment_txn     | billId               | Payment reference            |
 * | woo_shipping_method | CONFIG.SHIPPING_METHOD| Courier name               |
 * | currency            | CONFIG.CURRENCY      | MYR, SGD, etc.              |
 * | status              | 'processing'         | Always 'processing'         |
 * | set_paid            | derived              | 'true' for Online, 'false' for COD |
 * | products_info[x][sku]| product.sku         | UPPERCASE SKU                |
 * | products_info[x][quantity]| product.quantity| Number                     |
 * 
 * API ENDPOINT: https://woo.bizapp.my/v2/wooapi.php
 * API METHOD: WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU
 * SECRET KEY FORMAT: {your-key}-{currency-suffix}
 *   - MYR = -MY
 *   - SGD = -SG
 *   - USD = -US
 *   - BND = -BN
 *   - IDR = -ID
 */
