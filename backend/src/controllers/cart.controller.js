import Customer from '../models/Customer.model.js';
import Product from '../models/Product.model.js';
import Vendor from '../models/Vendor.model.js';

// --- Helper: Validate and Sanitize Cart Items ---
const validateItems = async (items) => {
    const validItems = [];
    const removedReasons = [];

    for (const item of items) {
        try {
            const product = await Product.findById(item.product_id).populate('vendor');

            // 1. Check Product Existence
            if (!product) {
                removedReasons.push(`Product no longer exists`);
                continue;
            }

            // 2. Check Product Status
            if (!product.isAvailable) {
                removedReasons.push(`${product.name} is currently unavailable`);
                continue;
            }

            // 3. Check Vendor Status
            if (!product.vendor) {
                removedReasons.push(`Vendor for ${product.name} no longer exists`);
                continue;
            }
            // Assuming Vendor model has isActive/isBlocked if needed, but existence is baseline

            // 4. Check Stock
            if (product.stock < item.quantity) {
                removedReasons.push(`Insufficient stock for ${product.name} (Available: ${product.stock})`);
                continue;
            }

            // 5. Update snapshot fields
            validItems.push({
                product_id: product._id,
                vendor_id: product.vendor._id,
                category: product.category, // for snapshot if needed
                category_id: product.category, // store category for consistency check
                quantity: item.quantity,
                price_snapshot: product.price,
                product_detail: product, // Attached for frontend convenience (not saved to DB)
                vendor_detail: product.vendor // Attached for frontend convenience
            });

        } catch (err) {
            console.error('Validation error for item:', item, err);
            removedReasons.push('Error validating item');
        }
    }

    return { validItems, removedReasons };
};

// --- GET CART (Fetch + Validate + Clean) ---
export const getCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const customer = await Customer.findById(customerId);

        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Auto-Validate on Fetch
        const { validItems, removedReasons } = await validateItems(customer.cart);

        // If changes occurred, save them
        if (removedReasons.length > 0 || validItems.length !== customer.cart.length) {
            // We only save the DB fields
            customer.cart = validItems.map(i => ({
                product_id: i.product_id,
                vendor_id: i.vendor_id,
                category_id: i.category_id,
                quantity: i.quantity,
                price_snapshot: i.price_snapshot
            }));
            await customer.save();
        }

        // Return the enriched valid items
        const enrichedCart = validItems.map(item => ({
            product: {
                _id: item.product_detail._id,
                name: item.product_detail.name,
                price: item.product_detail.price,
                image: item.product_detail.image,
                stock: item.product_detail.stock,
                category: item.product_detail.category,
                vendorName: item.vendor_detail.name
            },
            quantity: item.quantity
        }));

        res.status(200).json({
            cart: enrichedCart,
            removedItems: removedReasons
        });

    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
};

// --- SYNC CART (Merge/Overwrite from Frontend) ---
export const syncCart = async (req, res) => {
    try {
        const { cart } = req.body; // Array of { product: {_id...}, quantity }
        const customerId = req.user.id;

        if (!Array.isArray(cart)) return res.status(400).json({ message: 'Invalid cart format' });

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Transform frontend cart to DB structure for validation
        const candidateItems = cart.map(c => ({
            product_id: c.product._id || c.product.id,
            quantity: c.quantity
        }));

        // Validate everything
        const { validItems, removedReasons } = await validateItems(candidateItems);

        // Apply Consistency Rule: Single Vendor
        if (validItems.length > 0) {
            const firstVendor = validItems[0].vendor_id.toString();
            const firstCategory = validItems[0].category_id; // If enforcing category too

            const mixedVendor = validItems.some(i => i.vendor_id.toString() !== firstVendor);
            // const mixedCategory = validItems.some(i => i.category_id !== firstCategory); 

            if (mixedVendor) {
                return res.status(400).json({
                    message: 'Cart sync failed: Mixed vendors detected. Cart can only contain items from one vendor.'
                });
            }
        }

        // Update DB
        customer.cart = validItems.map(i => ({
            product_id: i.product_id,
            vendor_id: i.vendor_id,
            category_id: i.category_id,
            quantity: i.quantity,
            price_snapshot: i.price_snapshot
        }));

        await customer.save();

        // Enriched return
        const enrichedCart = validItems.map(item => ({
            product: {
                _id: item.product_detail._id,
                name: item.product_detail.name,
                price: item.product_detail.price,
                image: item.product_detail.image,
                stock: item.product_detail.stock,
                category: item.product_detail.category,
                vendorName: item.vendor_detail.name
            },
            quantity: item.quantity
        }));

        res.status(200).json({
            cart: enrichedCart,
            removedItems: removedReasons
        });

    } catch (error) {
        console.error('Sync Cart Error:', error);
        res.status(500).json({ message: 'Server error syncing cart' });
    }
};

// --- ADD TO CART ---
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customerId = req.user.id;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Validate Product
        const product = await Product.findById(productId).populate('vendor');
        if (!product || !product.isAvailable) {
            return res.status(400).json({ message: 'Product unavailable' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} available.` });
        }

        // Rule: Single Vendor
        if (customer.cart.length > 0) {
            const existingVendorId = customer.cart[0].vendor_id.toString();
            if (product.vendor._id.toString() !== existingVendorId) {
                return res.status(400).json({
                    message: 'Cart violation: You can only order from one vendor at a time. Clear cart to switch vendors.',
                    code: 'MIXED_VENDOR'
                });
            }

            // Rule: Single Category (Requested in Phase 3)
            // "Cart can contain ... ONLY one category"
            const existingCategory = customer.cart[0].category_id;
            if (product.category && existingCategory && product.category !== existingCategory) {
                return res.status(400).json({
                    message: 'Cart violation: You can only order from one category at a time.',
                    code: 'MIXED_CATEGORY'
                });
            }
        }

        // Check if item exists
        const existingIndex = customer.cart.findIndex(i => i.product_id.toString() === productId);

        if (existingIndex > -1) {
            // Update quantity
            const newQty = customer.cart[existingIndex].quantity + quantity;

            if (product.stock < newQty) {
                return res.status(400).json({ message: `Insufficient stock. Max available: ${product.stock}` });
            }

            customer.cart[existingIndex].quantity = newQty;
            customer.cart[existingIndex].price_snapshot = product.price; // Refresh price
            customer.cart[existingIndex].updated_at = new Date();
        } else {
            // Add new
            customer.cart.push({
                product_id: product._id,
                vendor_id: product.vendor._id,
                category_id: product.category,
                quantity: quantity,
                price_snapshot: product.price
            });
        }

        await customer.save();

        // Return full cart logic (reusing getCart logic roughly or explicitly returning)
        // For speed, let's just re-fetch or construct response. Re-fetch is safer to ensure populators.
        // Calling getCart internally or redirecting is complex in express, just copy logic or send success.
        res.status(200).json({ message: 'Added to cart' });

    } catch (error) {
        console.error('Add Cart Error:', error);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
};

// --- UPDATE QUANTITY ---
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customerId = req.user.id;

        if (quantity < 1) {
            // Should use remove endpoint, but we can handle it
            return removeFromCart(req, res);
        }

        const customer = await Customer.findById(customerId);
        const itemIndex = customer.cart.findIndex(i => i.product_id.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not in cart' });
        }

        // Validate Stock
        const product = await Product.findById(productId);
        if (!product || !product.isAvailable) {
            // Remove item if invalid
            customer.cart.splice(itemIndex, 1);
            await customer.save();
            return res.status(400).json({ message: 'Product no longer available, removed from cart' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: `Cannot increase quantity. Max available: ${product.stock}` });
        }

        customer.cart[itemIndex].quantity = quantity;
        customer.cart[itemIndex].updated_at = new Date();
        await customer.save();

        res.status(200).json({ message: 'Cart updated' });

    } catch (error) {
        console.error('Update Cart Error:', error);
        res.status(500).json({ message: 'Server error updating cart' });
    }
};

// --- REMOVE ITEM ---
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user.id;

        const customer = await Customer.findById(customerId);
        customer.cart = customer.cart.filter(i => i.product_id.toString() !== productId);

        await customer.save();
        res.status(200).json({ message: 'Item removed' });

    } catch (error) {
        console.error('Remove Cart Error:', error);
        res.status(500).json({ message: 'Server error removing item' });
    }
};

// --- CLEAR CART ---
export const clearCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const customer = await Customer.findById(customerId);
        customer.cart = [];
        await customer.save();
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
