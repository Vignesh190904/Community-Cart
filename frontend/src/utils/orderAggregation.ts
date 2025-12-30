/**
 * Aggregates order items by product ID or name
 * Groups identical products and sums their quantities
 * 
 * @param items - Raw order items array
 * @returns Aggregated items with combined quantities
 */

export interface AggregatedOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total?: number;
}

export interface RawOrderItem {
  productId?: { _id?: string; name?: string } | string;
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export function aggregateOrderItems(items: RawOrderItem[]): AggregatedOrderItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  const itemsMap = new Map<string, AggregatedOrderItem>();

  items.forEach((item) => {
    // Extract product ID - try multiple sources
    let productId: string;
    
    if (typeof item.productId === 'object' && item.productId?._id) {
      productId = item.productId._id;
    } else if (typeof item.productId === 'string') {
      productId = item.productId;
    } else if (typeof item.productId === 'object' && item.productId?.name) {
      productId = item.productId.name;
    } else {
      // Fallback to product name
      productId = item.name || 'unknown';
    }

    const itemName = item.name || 'Unknown Item';
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 0;

    if (itemsMap.has(productId)) {
      // Aggregate with existing item
      const existing = itemsMap.get(productId)!;
      existing.quantity += itemQuantity;
      if (existing.total !== undefined) {
        existing.total = existing.price * existing.quantity;
      }
    } else {
      // Create new aggregated item
      itemsMap.set(productId, {
        productId,
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity,
        total: item.total || (itemPrice * itemQuantity)
      });
    }
  });

  return Array.from(itemsMap.values());
}

/**
 * Calculates total from aggregated items
 */
export function calculateAggregatedTotal(items: AggregatedOrderItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
