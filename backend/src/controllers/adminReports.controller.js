import Order from "../models/Order.model.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const { dateFrom, dateTo, vendorId, community } = req.body;

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ message: "dateFrom and dateTo required" });
        }

        const filter = {
            createdAt: {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo),
            },
        };

        if (vendorId) filter.vendorId = vendorId;
        if (community)
            filter["delivery_address_snapshot.community"] = community;

        const orders = await Order.find(filter)
            .populate("vendorId")
            .populate("items.productId")
            .lean();

        let totalRevenue = 0;
        let totalOrders = orders.length;

        const vendorMap = {};
        const communityMap = {};
        const categoryMap = {};
        const statusMap = {};
        const revenueTrendMap = {};
        const heatmapMap = {};

        for (const order of orders) {
            const revenue = order?.pricing?.totalAmount || 0;
            totalRevenue += revenue;

            // Vendor Revenue
            const vendorName = order?.vendorId?.storeName || "Unknown";
            if (!vendorMap[vendorName]) vendorMap[vendorName] = 0;
            vendorMap[vendorName] += revenue;

            // Community Revenue
            const comm =
                order?.delivery_address_snapshot?.community || "Unknown";
            if (!communityMap[comm]) communityMap[comm] = 0;
            communityMap[comm] += revenue;

            // Status
            const status = order.status || "unknown";
            if (!statusMap[status]) statusMap[status] = 0;
            statusMap[status]++;

            // Revenue Trend (Daily)
            const dateKey = new Date(order.createdAt)
                .toISOString()
                .split("T")[0];
            if (!revenueTrendMap[dateKey]) revenueTrendMap[dateKey] = 0;
            revenueTrendMap[dateKey] += revenue;

            // Heatmap (Day x Hour)
            const dateObj = new Date(order.createdAt);
            const day = dateObj.getDay();
            const hour = dateObj.getHours();
            const heatKey = `${day}-${hour}`;
            if (!heatmapMap[heatKey]) heatmapMap[heatKey] = 0;
            heatmapMap[heatKey]++;

            // Category Revenue
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    const category =
                        item?.productId?.category || "unknown";
                    const itemRevenue =
                        (item.quantity || 0) * (item.price || 0);

                    if (!categoryMap[category]) categoryMap[category] = 0;
                    categoryMap[category] += itemRevenue;
                }
            }
        }

        const aov =
            totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Count both 'completed' and 'delivered' as successful outcomes
        const successCount =
            (statusMap["completed"] || 0) + (statusMap["delivered"] || 0);

        const successRate =
            totalOrders > 0
                ? (successCount / totalOrders) * 100
                : 0;

        const avgVendorRevenue =
            Object.keys(vendorMap).length > 0
                ? totalRevenue / Object.keys(vendorMap).length
                : 0;

        const topVendorEntry =
            Object.entries(vendorMap).sort((a, b) => b[1] - a[1])[0] || ["", 0];

        const topCommunityEntry =
            Object.entries(communityMap).sort((a, b) => b[1] - a[1])[0] || ["", 0];

        const topCategoryEntry =
            Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ["", 0];

        const vendorRevenue = Object.entries(vendorMap).map(
            ([name, revenue]) => ({
                name,
                revenue,
            })
        );

        const communityRevenue = Object.entries(communityMap).map(
            ([community, revenue]) => ({
                community,
                revenue,
            })
        );

        const categoryDistribution = Object.entries(categoryMap).map(
            ([category, revenue]) => ({
                category,
                revenue,
            })
        );

        const revenueTrend = Object.entries(revenueTrendMap).map(
            ([date, revenue]) => ({
                date,
                revenue,
            })
        );

        const orderStatusDistribution = Object.entries(statusMap).map(
            ([status, count]) => ({
                status,
                count,
            })
        );

        const heatmap = Object.entries(heatmapMap).map(
            ([key, count]) => {
                const [day, hour] = key.split("-");
                return {
                    day: Number(day),
                    hour: Number(hour),
                    count,
                };
            }
        );

        return res.json({
            kpis: {
                totalRevenue,
                totalOrders,
                aov,
                avgVendorRevenue,
                topVendor: {
                    name: topVendorEntry[0],
                    revenue: topVendorEntry[1],
                },
                topCommunity: {
                    name: topCommunityEntry[0],
                    revenue: topCommunityEntry[1],
                },
                topCategory: {
                    name: topCategoryEntry[0],
                    revenue: topCategoryEntry[1],
                },
                successRate,
            },
            revenueTrend,
            vendorRevenue,
            communityRevenue,
            categoryDistribution,
            orderStatusDistribution,
            heatmap,
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
