const API_BASE = 'http://localhost:5000/api';

export interface WishlistItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        stock: number;
        isAvailable: boolean;
        category?: string;
    };
    vendor: {
        _id: string;
        name: string;
    };
    added_at: string;
}

/**
 * Get JWT token from localStorage
 */
const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

/**
 * Create auth headers with JWT token
 */
const authHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Add a product to the wishlist
 * @param productId - The ID of the product to add
 */
export const addToWishlist = async (productId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/customers/wishlist`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to wishlist');
    }
};

/**
 * Remove a product from the wishlist
 * @param productId - The ID of the product to remove
 */
export const removeFromWishlist = async (productId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/customers/wishlist/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from wishlist');
    }
};

/**
 * Fetch the customer's wishlist with populated product and vendor data
 * @returns Array of wishlist items
 */
export const fetchWishlist = async (): Promise<WishlistItem[]> => {
    const response = await fetch(`${API_BASE}/customers/wishlist`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch wishlist');
    }

    return response.json();
};

/**
 * Check if a product is in the wishlist
 * @param productId - The ID of the product to check
 * @param wishlist - The current wishlist array
 * @returns true if product is in wishlist
 */
export const isInWishlist = (productId: string, wishlist: WishlistItem[]): boolean => {
    return wishlist.some(item => item.product._id === productId);
};
