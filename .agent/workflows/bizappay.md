---
description: How to create bills and process payments using Bizappay API
---

# Bizappay Payment Integration Guide

## API Endpoints

```
Production: https://api.bizappay.my/v3
Sandbox:    https://stg.bizappay.my/api/v3
```

## Authentication

- Method: HTTP Basic Auth
- Format: Base64 encode `{API_KEY}:`  (note the colon at end)
- Header: `Authorization: Basic {base64_encoded}`

```javascript
const auth = Buffer.from(apiKey + ':').toString('base64');
headers['Authorization'] = `Basic ${auth}`;
```

## Available MCP Tools

### 1. Get Categories (REQUIRED FIRST)

```
mcp_bizappay-bedaie_bizappay_bedaie_get_categories()
```

Returns category_code needed for creating bills.

### 2. Create Bill

```
mcp_bizappay-bedaie_bizappay_bedaie_create_bill(
    category_code: "xxx",      // From get_categories
    bill_name: "Customer Name",
    bill_email: "email@test.com",
    bill_phone: "60123456789",
    bill_amount: 6900,         // ⚠️ IN CENTS! RM69 = 6900
    bill_description: "Order description",
    callback_url: "https://yoursite.com/api/callback",
    redirect_url: "https://yoursite.com/thank-you"
)
```

Returns: `{ id, payment_url, ... }`

### 3. Get Bill Status

```
mcp_bizappay-bedaie_bizappay_bedaie_get_bill(bill_id: "xxx")
```

### 4. List Bills

```
mcp_bizappay-bedaie_bizappay_bedaie_list_bills(page: 1, per_page: 15)
```

### 5. Delete Bill (Unpaid only)

```
mcp_bizappay-bedaie_bizappay_bedaie_delete_bill(bill_id: "xxx")
```

### 6. Get FPX Banks

```
mcp_bizappay-bedaie_bizappay_bedaie_get_banks()
```

## Field Mappings

| API Field | Description | Example |
|-----------|-------------|---------|
| `category_code` | From get_categories | "CAT123" |
| `bill_name` | Payer name | "Ahmad bin Ali" |
| `bill_email` | Payer email | "<ahmad@email.com>" |
| `bill_phone` | Payer phone (MY format) | "60123456789" |
| `bill_amount` | Amount in CENTS | 6900 (= RM69) |
| `bill_description` | Payment description | "Pakej Famili x1" |
| `callback_url` | Webhook for payment status | "https://..." |
| `redirect_url` | Redirect after payment | "https://..." |
| `reference_1_label` | Custom field label | "Order ID" |
| `reference_1` | Custom field value | "ORD123" |

## Important Notes

1. ⚠️ **Amount is in CENTS**
   - RM69.00 = 6900
   - RM100.00 = 10000

2. **Phone format**: Start with 60 (Malaysia code)
   - ✅ 60123456789
   - ❌ 0123456789

3. **Workflow for creating payment:**

   ```
   1. Call get_categories → get category_code
   2. Call create_bill with all params
   3. Redirect user to payment_url
   4. Handle callback webhook for status update
   ```

## Accounts Available

| MCP Server | Account |
|------------|---------|
| `bizappay-bedaie` | BeDaie / Qada Solat |
| `bizappay-yaya-empire` | Yaya Empire |
| `bizappay-sifat-sahabat` | Sifat Sahabat (if exists) |

## Example: Create Bill in Code

```javascript
// Bizappay V3 API Call
const response = await fetch('https://api.bizappay.my/v3/bills', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`
    },
    body: JSON.stringify({
        category_code: 'YOUR_CATEGORY',
        bill_name: 'Customer Name',
        bill_email: 'email@test.com',
        bill_phone: '60123456789',
        bill_amount: 6900, // RM69 in cents
        bill_description: 'Order Description',
        callback_url: 'https://yoursite.com/api/webhook',
        redirect_url: 'https://yoursite.com/thank-you'
    })
});

const data = await response.json();
// Redirect user to: data.payment_url
```

## Callback Webhook Data

When payment completes, Bizappay sends POST to callback_url:

```json
{
    "id": "bill_id",
    "bill_status": "paid",  // or "failed"
    "bill_amount": 6900,
    "transaction_id": "TXN123",
    "paid_at": "2025-12-30T12:00:00Z"
}
```

## Common Mistakes to Avoid

1. ❌ Using RM amount instead of cents (RM69 should be 6900)
2. ❌ Missing colon in Basic auth: `apiKey:` not just `apiKey`
3. ❌ Phone without 60 prefix
4. ❌ Not calling get_categories first to get valid category_code
5. ❌ Using sandbox URL in production or vice versa
