import { instance, mock } from "../axios";

// --- TYPES (Matches your DB Schema/Lambda response) ---
export interface SearchResultItem {
    receipt_item_id: string;
    item_name: string;
    category: string;
    item_quantity: number;
    unit_price: number;
    receipt_datetime: string; // From Receipt table
    store_address: string; // From Store table
    chain_name: string;    // From Chain table
}

// --- MOCK SETUP ---
// This intercepts calls to "/search-purchases" for testing
// mock.onGet("/search-recent-purchases").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify([
//         {
//             receipt_item_id: "item_001",
//             item_name: "Organic Watermelon",
//             category: "Produce",
//             quantity: 1,
//             unit_price: 5.99,
//             purchase_date: "2025-11-14T10:00:00Z",
//             store_address: "100 Institute Rd",
//             chain_name: "Costco"
//         },
//         {
//             receipt_item_id: "item_002",
//             item_name: "Watermelon Slices",
//             category: "Produce",
//             quantity: 2,
//             unit_price: 3.50,
//             purchase_date: "2025-10-01T14:30:00Z",
//             store_address: "659 Worcester Rd",
//             chain_name: "Trader Joe's"
//         },
//         {
//             receipt_item_id: "item_003",
//             item_name: "Gallon Milk",
//             category: "Dairy",
//             quantity: 1,
//             unit_price: 2.99,
//             purchase_date: "2025-12-01T09:00:00Z",
//             store_address: "123 Main St",
//             chain_name: "Stop & Shop"
//         }
//     ])
// });

// --- REAL API FUNCTION ---
export async function searchPurchases(shopperID: string, query: string): Promise<SearchResultItem[]> {
    try {
        const response = await instance.get("search-recent-purchases", { 
            params: { 
                shopperID: shopperID,
                query: query,
                // Cache busting to prevent old results from sticking
                _t: Date.now() 
            } 
        });

        // Handle Lambda Proxy integration response structure
        let status = response.data.statusCode;
        
        // If the backend returns an error status inside the 200 OK wrapper
        if (status && status !== 200) {
            console.warn("API returned error status:", status);
            return [];
        }

        // Parse the body string if it exists (Lambda structure)
        if (response.data.body) {
            return JSON.parse(response.data.body);
        }
        
        // Fallback if response is direct JSON
        return response.data;

    } catch (error) {
        console.error("Search API Error:", error);
        return [];
    }
}