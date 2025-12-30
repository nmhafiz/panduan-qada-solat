"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizappApi = void 0;
class BizappApi {
    constructor() {
        this.name = "bizappApi";
        this.displayName = "Bizapp WooCommerce Integration (Unofficial)";
        this.documentationUrl = "https://sahabatxpert.my";
        this.properties = [
            {
                displayName: "Currency/Country",
                name: "currency",
                type: "options",
                options: [
                    {
                        name: "🇲🇾 Malaysia (MYR)",
                        value: "MYR",
                    },
                    {
                        name: "🇸🇬 Singapore (SGD)",
                        value: "SGD",
                    },
                    {
                        name: "🇺🇸 United States (USD)",
                        value: "USD",
                    },
                    {
                        name: "🇧🇳 Brunei (BND)",
                        value: "BND",
                    },
                    {
                        name: "🇮🇩 Indonesia (IDR)",
                        value: "IDR",
                    },
                ],
                default: "MYR",
                description: "Select your country/currency for the appropriate secret key format. Base URL is automatically set to https://woo.bizapp.my",
                required: true,
            },
            {
                displayName: "WooCommerce Secret Key",
                name: "secretKey",
                type: "string",
                typeOptions: {
                    password: true,
                },
                default: "",
                placeholder: "Use your WooCommerce Secret Key (NOT the API Secret Key)",
                description: "⚠️ IMPORTANT: Use your WooCommerce Secret Key (NOT the API Secret Key). API keys will cause charges/malfunction. The system will automatically append the correct country suffix based on your currency selection above. Get WooCommerce key from Bizapp dashboard Integration section.",
                required: true,
            },
        ];
    }
}
exports.BizappApi = BizappApi;
