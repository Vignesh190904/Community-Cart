/**
 * Joi validation schemas for order-related operations
 * Used for validating request data in vendor order endpoints
 */

const Joi = require('joi');
const { commonSchemas } = require('../middleware/validate');

/**
 * Valid order statuses and their allowed transitions
 */
const ORDER_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Allowed status transitions for orders
 */
const STATUS_TRANSITIONS = {
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.ACCEPTED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.ACCEPTED]: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.READY, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.READY]: [ORDER_STATUSES.COMPLETED],
  [ORDER_STATUSES.COMPLETED]: [], // Final state
  [ORDER_STATUSES.CANCELLED]: [] // Final state
};

/**
 * Schema for updating order status
 */
const updateStatusSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  
  body: Joi.object({
    status: Joi.string()
      .valid(...Object.values(ORDER_STATUSES))
      .required()
      .messages({
        'any.only': `Status must be one of: ${Object.values(ORDER_STATUSES).join(', ')}`,
        'any.required': 'Status is required'
      }),
    
    notes: Joi.string()
      .trim()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 500 characters'
      })
  })
};

/**
 * Schema for getting a single order
 */
const getOrderSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

/**
 * Schema for listing orders with filters
 */
const listOrdersSchema = {
  query: Joi.object({
    // Pagination
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    
    // Sorting
    sort: Joi.string()
      .valid('created_at', 'updated_at', 'total_amount', 'status')
      .default('created_at'),
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
    
    // Filtering
    status: Joi.string()
      .valid(...Object.values(ORDER_STATUSES))
      .optional(),
    
    from: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'From date must be in ISO format (YYYY-MM-DD)'
      }),
    
    to: Joi.date()
      .iso()
      .min(Joi.ref('from'))
      .optional()
      .messages({
        'date.format': 'To date must be in ISO format (YYYY-MM-DD)',
        'date.min': 'To date must be after from date'
      }),
    
    customer_name: Joi.string()
      .trim()
      .max(255)
      .allow('')
      .optional(),
    
    min_amount: Joi.number()
      .positive()
      .precision(2)
      .optional(),
    
    max_amount: Joi.number()
      .positive()
      .precision(2)
      .min(Joi.ref('min_amount'))
      .optional()
  })
};

/**
 * Schema for getting order timeline/history
 */
const getOrderTimelineSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

/**
 * Schema for creating order status history entry
 */
const createStatusHistorySchema = {
  body: Joi.object({
    order_id: commonSchemas.uuid,
    status: Joi.string()
      .valid(...Object.values(ORDER_STATUSES))
      .required(),
    notes: Joi.string()
      .trim()
      .max(500)
      .allow('')
      .optional(),
    changed_by_vendor_id: commonSchemas.uuid
  })
};

/**
 * Schema for order analytics/summary
 */
const orderAnalyticsSchema = {
  query: Joi.object({
    range: Joi.string()
      .valid('today', '7d', '30d', '90d', 'custom')
      .default('7d'),
    
    from: Joi.date()
      .iso()
      .when('range', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
    
    to: Joi.date()
      .iso()
      .min(Joi.ref('from'))
      .when('range', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
    
    group_by: Joi.string()
      .valid('day', 'week', 'month')
      .default('day')
  })
};

/**
 * Custom validation function to check if status transition is allowed
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - New status to transition to
 * @returns {boolean} - Whether transition is allowed
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
  if (!currentStatus || !newStatus) return false;
  
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

/**
 * Schema for validating status transition
 */
const validateStatusTransition = {
  body: Joi.object({
    current_status: Joi.string()
      .valid(...Object.values(ORDER_STATUSES))
      .required(),
    new_status: Joi.string()
      .valid(...Object.values(ORDER_STATUSES))
      .required()
  }).custom((value, helpers) => {
    const { current_status, new_status } = value;
    
    if (!isValidStatusTransition(current_status, new_status)) {
      return helpers.error('custom.invalidTransition', {
        current: current_status,
        new: new_status,
        allowed: STATUS_TRANSITIONS[current_status] || []
      });
    }
    
    return value;
  }).messages({
    'custom.invalidTransition': 'Invalid status transition from {{#current}} to {{#new}}. Allowed transitions: {{#allowed}}'
  })
};

module.exports = {
  ORDER_STATUSES,
  STATUS_TRANSITIONS,
  updateStatusSchema,
  getOrderSchema,
  listOrdersSchema,
  getOrderTimelineSchema,
  createStatusHistorySchema,
  orderAnalyticsSchema,
  validateStatusTransition,
  isValidStatusTransition
};
