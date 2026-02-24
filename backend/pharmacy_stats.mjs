// Pharmacy vendor stats — outputs clean JSON to pharmacy_result.json
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:5000/api';
const OUT = './pharmacy_result.json';

async function main() {
    const result = {};

    // 1. Login
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pharmacy@gmail.com', password: '12345678' }),
    });
    const loginBody = await loginRes.json();
    if (!loginRes.ok || !loginBody.success) throw new Error('Login failed: ' + JSON.stringify(loginBody));

    const { auth_token, user } = loginBody.data;
    result.vendor = { id: user.id, name: user.name, email: user.email, role: user.role };

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth_token}` };

    // 2. Product sales KPIs
    const kpiRes = await fetch(`${BASE}/product-sales/kpis?vendorId=${user.id}`, { headers });
    result.productKPIs = await kpiRes.json();

    // 3. Orders (all statuses)
    const ordersRes = await fetch(`${BASE}/orders?vendorId=${user.id}`, { headers });
    const allOrders = await ordersRes.json();
    const orders = Array.isArray(allOrders) ? allOrders : [];

    const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    const successOrders = orders.filter(o => ['completed', 'delivered'].includes(o.status));
    const totalRevenue = successOrders.reduce((s, o) => s + (o.pricing?.totalAmount || 0), 0);

    const productCounts = {};
    orders.forEach(o => (o.items || []).forEach(item => {
        const name = item.name || 'Unknown';
        productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
    }));
    const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5)
        .map(o => ({ id: o.orderNumber || o._id, status: o.status, amount: o.pricing?.totalAmount, date: o.createdAt?.slice(0, 10) }));

    result.orders = {
        total: orders.length,
        byStatus,
        successfulOrders: successOrders.length,
        totalRevenue,
        avgOrderValue: successOrders.length ? totalRevenue / successOrders.length : 0,
        successRate: orders.length ? ((successOrders.length / orders.length) * 100).toFixed(1) + '%' : '0%',
        topProducts,
        recentOrders,
    };

    // 4. Products catalogue
    const prodsRes = await fetch(`${BASE}/products?vendorId=${user.id}`, { headers });
    const prods = await prodsRes.json();
    const prodsArr = Array.isArray(prods) ? prods : [];

    result.catalogue = {
        total: prodsArr.length,
        available: prodsArr.filter(p => p.isAvailable !== false).length,
        outOfStock: prodsArr.filter(p => p.stock === 0).length,
        products: prodsArr.map(p => ({ name: p.name, price: p.price, stock: p.stock, available: p.isAvailable })),
    };

    writeFileSync(OUT, JSON.stringify(result, null, 2));
}

main().catch(e => {
    writeFileSync(OUT, JSON.stringify({ error: e.message }, null, 2));
});
