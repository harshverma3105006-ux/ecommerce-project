const fetchAPI = async (endpoint) => {
    try {
        const res = await fetch("../products.json"); // adjust path if needed
        const data = await res.json();

        // GET ALL PRODUCTS
        if (endpoint === "/products") {
            return data;
        }

        // GET SINGLE PRODUCT
        if (endpoint.startsWith("/products/")) {
            const id = endpoint.split("/")[2];
            return data.find(p => p.id === id);
        }

        return null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
