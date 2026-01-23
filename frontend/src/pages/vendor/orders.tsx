import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useToast } from '../../components/ui/ToastProvider';
import { aggregateOrderItems } from '../../utils/orderAggregation';
import { useAuth } from '../../context/AuthContext';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface OrderResponse {
  order_id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  customer: {
    name: string;
    phone: string;
  };
  delivery_address_snapshot: {
    community?: string;
    block?: string;
    floor?: string;
    flat_number?: string;
  };
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  pricing: {
    totalAmount: number;
  };
  status: OrderStatus;
  createdAt: string;
}

export default function VendorOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      console.log('[vendor:loadOrders] Fetching orders');

      const res = await fetch('http://localhost:5000/api/vendors/orders');

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrderResponse[] = await res.json();
      console.log('[vendor:loadOrders] fetched orders count=', data.length);

      // Map snapshot-based response to UI format
      const mappedOrders: Order[] = data.map((orderResponse) => {
        // Format delivery address from snapshot
        const addressParts = [];
        if (orderResponse.delivery_address_snapshot?.flat_number) {
          addressParts.push(`Flat ${orderResponse.delivery_address_snapshot.flat_number}`);
        }
        if (orderResponse.delivery_address_snapshot?.floor) {
          addressParts.push(`Floor ${orderResponse.delivery_address_snapshot.floor}`);
        }
        if (orderResponse.delivery_address_snapshot?.block) {
          addressParts.push(`Block ${orderResponse.delivery_address_snapshot.block}`);
        }
        if (orderResponse.delivery_address_snapshot?.community) {
          addressParts.push(orderResponse.delivery_address_snapshot.community);
        }
        const deliveryAddress = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';

        return {
          _id: orderResponse.order_id,
          orderNumber: orderResponse.order_number,
          customerName: orderResponse.customer.name || 'Unknown Customer',
          customerPhone: orderResponse.customer.phone || 'N/A',
          deliveryAddress,
          items: orderResponse.items.map((item) => ({
            productId: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
          pricing: {
            totalAmount: orderResponse.total_amount,
          },
          status: orderResponse.status,
          createdAt: orderResponse.created_at,
        };
      });

      setOrders(mappedOrders);
    } catch (error: any) {
      pushToast({ type: 'error', message: error.message || 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return {
      pending: orders.filter((o) => o.status === 'pending'),
      processing: orders.filter((o) => o.status === 'processing'),
      completed: orders.filter((o) => {
        if (o.status !== 'completed' && o.status !== 'cancelled') return false;
        const d = new Date(o.createdAt);
        return d >= startOfToday && d < endOfToday;
      }),
    };
  }, [orders]);

  const canDropTo = (sourceStatus: OrderStatus, destStatus: OrderStatus): boolean => {
    if (sourceStatus === 'pending' && destStatus === 'processing') return true;
    if (sourceStatus === 'processing' && destStatus === 'completed') return true;
    return false;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Store original state for rollback on failure
    const originalOrder = orders.find((o) => o._id === orderId);
    if (!originalOrder) return;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      const updated = await res.json();
      console.log('[vendor:updateStatus] orderId=', orderId, 'status=', newStatus);
      pushToast({ type: 'success', message: `Order moved to ${newStatus}` });
    } catch (error: any) {
      // Rollback on failure
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? originalOrder : o))
      );
      pushToast({ type: 'error', message: error.message || 'Could not update order' });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside valid zone
    if (!destination) {
      return;
    }

    // Dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as OrderStatus;
    const destStatus = destination.droppableId as OrderStatus;

    // Check if transition is allowed
    if (!canDropTo(sourceStatus, destStatus)) {
      console.warn(`[vendor:drag] Invalid transition from ${sourceStatus} to ${destStatus}`);
      return;
    }

    // Update order status
    updateOrderStatus(draggableId, destStatus);
  };

  const advance = (id: string, currentStatus: OrderStatus) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(id, 'processing');
    } else if (currentStatus === 'processing') {
      updateOrderStatus(id, 'completed');
    }
  };

  const cancelOrder = (id: string) => {
    updateOrderStatus(id, 'cancelled');
  };

  const handleViewOrder = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/vendor/orderdetails?orderId=${orderId}`);
  };

  const rejectOrder = (id: string) => {
    updateOrderStatus(id, 'cancelled');
  };

  const Column = ({
    title,
    type,
    items,
  }: {
    title: string;
    type: OrderStatus;
    items: Order[];
  }) => (
    <Droppable droppableId={type}>
      {(provided, snapshot) => (
        <section
          className={`orders-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
          aria-label={`${title} orders`}
        >
          <header className="orders-column-header">
            <h2 className="orders-column-title">{title}</h2>
            <span className="orders-count">{items.length}</span>
          </header>
          <div className="orders-column-body">
            {items.map((o, index) => (
              <Draggable
                key={o._id}
                draggableId={o._id}
                index={index}
                isDragDisabled={type === 'completed'}
              >
                {(provided, snapshot) => (
                  <article
                    className={`order-card ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="order-row">
                      <div className="order-id">{o.orderNumber || o._id}</div>
                      <div className="order-total">₹{o.pricing.totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="order-customer">
                      {o.customerName}
                    </div>
                    <div className="order-customer" style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                      📞 {o.customerPhone}
                    </div>
                    <div className="order-customer" style={{ fontSize: '0.85em', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      📍 {o.deliveryAddress}
                    </div>
                    <div className="order-items">
                      {aggregateOrderItems(o.items).map((item) => (
                        <div
                          key={item.productId}
                          style={{
                            marginBottom: '4px',
                          }}
                        >
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                    <div className="order-meta">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    {o.status === 'completed' || o.status === 'cancelled' ? (
                      <div className="order-footer">
                        <button
                          className="btn-view-order"
                          onClick={(e) => handleViewOrder(e, o._id)}
                          title="View Order"
                          aria-label="View order details"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <span
                          className={`status-badge ${o.status === 'cancelled' ? 'cancelled' : 'done'
                            }`}
                        >
                          {o.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      </div>
                    ) : (
                      <div className="order-footer">
                        <button
                          className="btn-view-order"
                          onClick={(e) => handleViewOrder(e, o._id)}
                          title="View Order"
                          aria-label="View order details"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        {type === 'pending' && (
                          <div className="btn-group">
                            <button
                              className="btn-small primary"
                              onClick={() => advance(o._id, o.status)}
                            >
                              Accept
                            </button>
                            <button
                              className="btn-small danger"
                              onClick={() => rejectOrder(o._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {type === 'processing' && (
                          <div className="btn-group">
                            <button
                              className="btn-small primary"
                              onClick={() => advance(o._id, o.status)}
                            >
                              Done
                            </button>
                            <button
                              className="btn-small danger"
                              onClick={() => cancelOrder(o._id)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </section>
      )}
    </Droppable>
  );

  if (loading) {
    return (
      <div className="orders-board">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading orders...
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="orders-board">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Please login to view vendor orders.
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="orders-board" role="region" aria-label="Orders Kanban Board">
        <Column title="Pending" type="pending" items={columns.pending} />
        <Column title="Processing" type="processing" items={columns.processing} />
        <Column title="Final Status" type="completed" items={columns.completed} />
      </div>
    </DragDropContext>
  );
}
