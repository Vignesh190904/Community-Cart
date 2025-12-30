import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';

const parseDateRange = (startDate, endDate) => {
  const filter = {};
  if (startDate) filter.$gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    // include end of day
    end.setHours(23, 59, 59, 999);
    filter.$lte = end;
  }
  return Object.keys(filter).length ? filter : undefined;
};

const stockStatusOf = (product) => {
  const stock = product.stock || 0;
  const threshold = product.threshold || 5;
  if (stock === 0) return 'out';
  if (stock <= threshold) return 'low';
  return 'in';
};

export const getAnalytics = async (req, res) => {
  try {
    const {
      vendorId,
      startDate,
      endDate,
      search,
      category,
      stockStatus,
      minUnitsSold,
      minRevenue,
      zeroSalesOnly,
      page = 1,
      limit = 10,
      sortBy = 'revenue',
      sortOrder = 'desc',
      productId,
    } = req.query;

    if (!vendorId) return res.status(400).json({ error: 'vendorId is required' });

    // Fetch all products for the vendor (to include zero-sales)
    const productFilter = { vendor: vendorId };
    if (category) productFilter.category = category;

    let products = await Product.find(productFilter).lean();

    // Build date filter for orders
    const dateFilter = parseDateRange(startDate, endDate);
    const orderFilter = { vendorId };
    if (dateFilter) orderFilter.createdAt = dateFilter;
    // Load orders once
    const orders = await Order.find(orderFilter).lean();

    // Aggregate per product
    const byProduct = new Map();
    for (const p of products) {
      byProduct.set(p._id.toString(), {
        _id: p._id.toString(),
        name: p.name,
        category: p.category || '',
        currentStock: p.stock || 0,
        stockStatus: stockStatusOf(p),
        unitsSold: 0,
        revenue: 0,
        ordersCount: 0,
        avgSellingPrice: 0,
      });
    }

    for (const o of orders) {
      const isCompleted = o.status === 'completed';
      for (const item of o.items || []) {
        const pid = item.productId?.toString();
        if (!pid || !byProduct.has(pid)) continue;
        const agg = byProduct.get(pid);
        agg.ordersCount += 1;
        if (isCompleted) {
          agg.unitsSold += Number(item.quantity) || 0;
          agg.revenue += Number(item.total) || (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }
      }
    }

    // Finalize avg price and apply filters
    let rows = Array.from(byProduct.values()).map((r) => ({
      ...r,
      avgSellingPrice: r.unitsSold > 0 ? r.revenue / r.unitsSold : 0,
    }));

    if (search) {
      const q = String(search).toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q));
    }
    if (stockStatus) rows = rows.filter((r) => r.stockStatus === stockStatus);
    if (minUnitsSold) rows = rows.filter((r) => r.unitsSold >= Number(minUnitsSold));
    if (minRevenue) rows = rows.filter((r) => r.revenue >= Number(minRevenue));
    if (zeroSalesOnly === 'true') rows = rows.filter((r) => r.unitsSold === 0);
    if (productId) rows = rows.filter((r) => r._id === String(productId));

    // Sorting
    rows.sort((a, b) => {
      const factor = sortOrder === 'asc' ? 1 : -1;
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });

    const totalCount = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / Number(limit)));
    const start = (Number(page) - 1) * Number(limit);
    const productsPage = rows.slice(start, start + Number(limit));

    res.json({ products: productsPage, totalCount, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute analytics' });
  }
};

export const getKPIs = async (req, res) => {
  try {
    const { vendorId, startDate, endDate } = req.query;
    if (!vendorId) return res.status(400).json({ error: 'vendorId is required' });

    const dateFilter = parseDateRange(startDate, endDate);
    const orderFilter = { vendorId };
    if (dateFilter) orderFilter.createdAt = dateFilter;
    const orders = await Order.find(orderFilter).lean();

    let totalUnitsSold = 0;
    let totalRevenue = 0;
    let cancelled = 0;
    const perProductUnits = new Map();

    for (const o of orders) {
      if (o.status === 'cancelled') cancelled += 1;
      const isCompleted = o.status === 'completed';
      for (const item of o.items || []) {
        if (isCompleted) {
          const qty = Number(item.quantity) || 0;
          const rev = Number(item.total) || (Number(item.price) || 0) * qty;
          totalUnitsSold += qty;
          totalRevenue += rev;
          const pid = item.productId?.toString();
          if (pid) perProductUnits.set(pid, (perProductUnits.get(pid) || 0) + qty);
        }
      }
    }

    // Best-selling product name
    let bestSellingProduct = '—';
    if (perProductUnits.size > 0) {
      const [bestPid] = Array.from(perProductUnits.entries()).sort((a, b) => b[1] - a[1])[0];
      const bestProduct = await Product.findById(bestPid).lean();
      bestSellingProduct = bestProduct?.name || '—';
    }

    // Zero-sales products in period
    const vendorProducts = await Product.find({ vendor: vendorId }).lean();
    const zeroSalesProducts = vendorProducts.reduce((count, p) => count + (perProductUnits.get(p._id.toString()) ? 0 : 1), 0);

    const totalOrders = orders.length;
    const cancellationRate = totalOrders > 0 ? (cancelled / totalOrders) * 100 : 0;

    res.json({ totalUnitsSold, totalRevenue, bestSellingProduct, zeroSalesProducts, cancellationRate });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to compute KPIs' });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const { vendorId, startDate, endDate } = req.query;
    if (!vendorId) return res.status(400).json({ error: 'vendorId is required' });

    const product = await Product.findOne({ _id: productId, vendor: vendorId }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found for vendor' });

    const dateFilter = parseDateRange(startDate, endDate);
    const orderFilter = { vendorId };
    if (dateFilter) orderFilter.createdAt = dateFilter;
    const orders = await Order.find(orderFilter).lean();

    let totalUnitsSold = 0;
    let totalRevenue = 0;
    let ordersCount = 0;
    let completedOrdersCount = 0;
    let cancelledOrdersCount = 0;
    const trendMap = new Map(); // date -> { unitsSold, revenue }
    const detailOrders = [];

    for (const o of orders) {
      let containsProduct = false;
      let itemForProduct = null;
      for (const item of o.items || []) {
        if (String(item.productId) === String(productId)) {
          containsProduct = true;
          itemForProduct = item;
          break;
        }
      }
      if (!containsProduct) continue;

      ordersCount += 1;
      if (o.status === 'completed') completedOrdersCount += 1;
      if (o.status === 'cancelled') cancelledOrdersCount += 1;

      const qty = Number(itemForProduct.quantity) || 0;
      const rev = Number(itemForProduct.total) || (Number(itemForProduct.price) || 0) * qty;
      if (o.status === 'completed') {
        totalUnitsSold += qty;
        totalRevenue += rev;
      }

      const dayKey = new Date(o.createdAt).toISOString().slice(0, 10);
      const current = trendMap.get(dayKey) || { unitsSold: 0, revenue: 0 };
      if (o.status === 'completed') {
        current.unitsSold += qty;
        current.revenue += rev;
      }
      trendMap.set(dayKey, current);

      detailOrders.push({
        _id: o._id,
        orderNumber: o.orderNumber,
        customerName: o.customerId?.name || '—',
        quantity: qty,
        price: Number(itemForProduct.price) || 0,
        total: Number(itemForProduct.total) || 0,
        status: o.status,
        date: o.createdAt,
      });
    }

    const avgSellingPrice = totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 0;
    const cancellationRate = ordersCount > 0 ? (cancelledOrdersCount / ordersCount) * 100 : 0;
    const stockSalesRatio = totalUnitsSold > 0 ? (product.stock || 0) / totalUnitsSold : Infinity;

    const trendData = Array.from(trendMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, val]) => ({ date, unitsSold: val.unitsSold, revenue: val.revenue }));

    res.json({
      productId: product._id,
      productName: product.name,
      category: product.category || '',
      currentStock: product.stock || 0,
      totalUnitsSold,
      totalRevenue,
      avgSellingPrice,
      ordersCount,
      completedOrdersCount,
      cancelledOrdersCount,
      cancellationRate,
      stockSalesRatio,
      trendData,
      orders: detailOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch product detail' });
  }
};
