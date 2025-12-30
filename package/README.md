# n8n-nodes-bizapp

## ⚠️ IMPORTANT DISCLAIMER

**THIS IS AN UNOFFICIAL THIRD-PARTY INTEGRATION**

- ❌ **NOT affiliated with, endorsed by, or supported by Bizapp**
- ❌ **NOT an official Bizapp product**
- ✅ **Independent reverse-engineered connector**
- ✅ **Use at your own risk**
- ✅ **For educational/integration purposes only**

**Bizapp® is a trademark of its respective owners.**

---

![npm version](https://img.shields.io/npm/v/n8n-nodes-bizapp?style=flat-square&color=blue)
![license](https://img.shields.io/npm/l/n8n-nodes-bizapp?style=flat-square&color=green)
![downloads](https://img.shields.io/npm/dm/n8n-nodes-bizapp?style=flat-square&color=orange)

**Unofficial n8n Community Node for Bizapp Integration**

Third-party integration with Bizapp order management system. **NOT OFFICIAL - USE AT YOUR OWN RISK.**

## 🚀 Features

- ✅ Direct Order Submission to Bizapp
- ✅ Multi-Currency Support (MYR, USD, SGD, BND, IDR)
- ✅ Payment Gateway Integration (COD, Online Banking)
- ✅ Auto-Generation for missing customer data
- ✅ Smart URL Generation with anti-blocking protection
- ✅ Real-time order processing

## 🛠 Installation

```bash
npm install n8n-nodes-bizapp
```

## ⚙️ Quick Setup

**1. Get Bizapp Account**
   - Register: [https://register.bizapp.my/bizapp/1919914](https://register.bizapp.my/bizapp/1919914)
   - **REQUIRED:** Subscribe to Bizapp Ultimate Package

**2. Configure Credentials**
   - Add Bizapp credentials in n8n
   - Use your integration key
   - Select your currency/country

**3. Start Using**
   - Drag Bizapp node into workflow
   - Configure order parameters
   - Connect to your data sources

## 📖 Basic Usage

```javascript
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com", 
  "customerPhone": "+60123456789",
  "customerAddress": "123 Main Street, KL",
  "sellingPrice": 99.90,
  "postagePrice": 10.00,
  "products": [
    {
      "sku": "PRODUCT-001",
      "quantity": 2
    }
  ]
}
```

## ⚠️ Important Notes

**LEGAL DISCLAIMER:**
- ⚠️ **This is an UNOFFICIAL third-party connector**
- ⚠️ **NOT endorsed or supported by Bizapp**
- ⚠️ **Use at your own risk and responsibility**
- ⚠️ **Created through reverse engineering for interoperability**

**TECHNICAL REQUIREMENTS:**
- **Bizapp Ultimate Package required** for integration
- Use proper credentials configuration
- Auto-generation works when customer phone is provided
- Users must comply with Bizapp Terms of Service

## 🔧 Auto-Generation Features

When customer phone is provided but other fields are empty:
- Customer Name: Auto-generated
- Customer Email: Auto-generated with safe domain
- Customer Address: Auto-generated
- WooCommerce URL: Auto-generated if empty or blocked
- Order ID: Auto-generated with timestamp

## 📄 License

MIT License

---

**Unofficial integration by [Sahabat Xpert](https://sahabatxpert.my)** - Third-party connector for educational purposes.