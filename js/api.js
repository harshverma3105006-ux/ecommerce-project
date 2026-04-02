// ============================
// LOCAL PRODUCTS API (STATIC)
// ============================

// Fake API using local JSON
const fetchAPI = async (endpoint) => {
    try {
        // Only products supported
        if (endpoint === "/products") {
            const res = await fetch("products.json");
            const data = await res.json();
            return data;
        }

        return [];
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};
