---
description: How to submit orders to Bizapp HQ API with correct field mappings
---

# Bizapp HQ Order Submission Guide

## API Endpoint

```
https://woo.bizapp.my/v2/wooapi.php
```

## API Method

```
WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU
```

## Authentication

- Secret key format: `{your-key}-{currency-suffix}`
- Currency suffixes: MYR = `-MY`, SGD = `-SG`, USD = `-US`, BND = `-BN`, IDR = `-ID`
- Secret key must be URL encoded in query string: `encodeURIComponent(secretKey)`

## Required Field Mappings

| Bizapp Field | Description | Example |
|--------------|-------------|---------|
| `name` | Customer full name | Ahmad bin Ali |
| `email` | Customer email | <ahmad@email.com> |
| `hpno` | Customer phone ⚠️ NOT 'phone' | 60123456789 |
| `address` | Full address with postcode & state | No. 1, Jalan ABC, 40000 Shah Alam, Selangor |
| `sellingprice` | Total amount | 69 |
| `postageprice` | Shipping cost | 0 |
| `note` | Order notes (can include payment link) | Description \| Payment Link: url \| Ref: id |
| `woo_url` | Your website URL | <https://yoursite.com> |
| `woo_orderid` | 7-character unique ID | 1234567 |
| `woo_paymentgateway` | Payment method | Online Banking / Cash On Delivery (COD) |
| `woo_paymentgateway_id` | Payment ID | online_banking / cod |
| `woo_payment_txn` | Transaction/Bill ID | BILL123 |
| `woo_shipping_method` | Courier | Pos Laju |
| `currency` | Currency code | MYR |
| `status` | Order status | processing |
| `set_paid` | Payment status | true (Online) / false (COD) |
| `products_info[0][sku]` | Product SKU (UPPERCASE) | BUKUQADASOLAT |
| `products_info[0][quantity]` | Quantity | 3 |

## Generate 7-Character Order ID

```javascript
const timestamp = Date.now().toString();
const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
const wooOrderId = (timestamp + randomSuffix).slice(-7);
```

## Request Format

- Method: POST
- Content-Type: application/x-www-form-urlencoded
- Body: URLSearchParams

## Example Code (Node.js)

```javascript
const formData = new URLSearchParams();
formData.append('name', customerName);
formData.append('email', customerEmail);
formData.append('hpno', customerPhone);  // ⚠️ IMPORTANT: 'hpno' not 'phone'
formData.append('address', customerAddress);
formData.append('sellingprice', totalPrice.toString());
formData.append('postageprice', '0');
formData.append('note', orderNotes);
formData.append('woo_url', 'https://yoursite.com');
formData.append('woo_orderid', wooOrderId);
formData.append('woo_paymentgateway', 'Online Banking');
formData.append('woo_paymentgateway_id', 'online_banking');
formData.append('currency', 'MYR');
formData.append('status', 'processing');
formData.append('set_paid', 'true');
formData.append('products_info[0][sku]', 'PRODUCTSKU');
formData.append('products_info[0][quantity]', '1');

const url = `https://woo.bizapp.my/v2/wooapi.php?api_name=WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU&secretkey=${encodeURIComponent(secretKey)}`;

const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
});
```

## Reusable Client Location

Copy from any project with Bizapp integration:

- Node.js: `/lib/bizapp-client.js`
- Deno/Supabase: `/lib/bizapp-client.ts`

## Common Mistakes to Avoid

1. ❌ Using `phone` instead of `hpno`
2. ❌ Not encoding secret key with `encodeURIComponent()`
3. ❌ Not appending currency suffix to secret key
4. ❌ Using lowercase SKU (must be UPPERCASE)
5. ❌ Order ID longer than 7 characters
6. ❌ Auto-generated fake woo_url - always use your real website URL
