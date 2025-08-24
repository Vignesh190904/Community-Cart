// Chatbot menu structure and responses
const chatbotMenus = {
  main: {
    message: "Welcome to Community Cart Support! How can I help you today?",
    options: [
      { id: "order_trouble", text: "Order Trouble" },
      { id: "payment_issue", text: "Payment Issue" },
      { id: "items_issue", text: "Items Issue" },
      { id: "vendor_care", text: "Vendor Customer Care" }
    ]
  },
  
  order_trouble: {
    message: "I'm here to help with your order issues. What specific problem are you facing?",
    options: [
      { id: "order_not_received", text: "Order not received" },
      { id: "wrong_items", text: "Wrong items delivered" },
      { id: "delayed_delivery", text: "Delayed delivery" },
      { id: "order_cancellation", text: "Cancel my order" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  payment_issue: {
    message: "Let me help you with payment-related issues. What's the problem?",
    options: [
      { id: "payment_failed", text: "Payment failed" },
      { id: "refund_request", text: "Request refund" },
      { id: "double_charged", text: "Double charged" },
      { id: "payment_method", text: "Change payment method" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  items_issue: {
    message: "I can help you with product-related issues. What's the problem?",
    options: [
      { id: "damaged_items", text: "Items arrived damaged" },
      { id: "expired_items", text: "Items are expired" },
      { id: "missing_items", text: "Missing items from order" },
      { id: "quality_issue", text: "Poor quality items" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  vendor_care: {
    message: "Need to contact a specific vendor? I can help you get in touch.",
    options: [
      { id: "vendor_contact", text: "Get vendor contact details" },
      { id: "vendor_complaint", text: "File vendor complaint" },
      { id: "vendor_feedback", text: "Give vendor feedback" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  }
};

// Predefined responses for specific issues
const issueResponses = {
  order_not_received: {
    message: "I understand your order hasn't arrived. Here's what we can do:\n\n1. Check your order status in the app\n2. Contact the vendor directly\n3. We can escalate this to our support team\n\nWould you like me to help you with any of these options?",
    options: [
      { id: "check_status", text: "Check order status" },
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "escalate", text: "Escalate to support" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  wrong_items: {
    message: "I'm sorry you received wrong items. Here's how we can resolve this:\n\n1. Contact the vendor immediately\n2. Take photos of the wrong items\n3. We'll arrange for a replacement or refund\n\nWhat would you prefer to do?",
    options: [
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "request_refund", text: "Request refund" },
      { id: "request_replacement", text: "Request replacement" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  delayed_delivery: {
    message: "I understand your delivery is delayed. This can happen due to:\n\n• High order volume\n• Weather conditions\n• Vendor availability\n\nWould you like to:\n1. Check updated delivery time\n2. Contact the vendor\n3. Cancel the order",
    options: [
      { id: "check_delivery", text: "Check delivery time" },
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "cancel_order", text: "Cancel order" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  order_cancellation: {
    message: "To cancel your order:\n\n1. Go to your order history\n2. Select the order you want to cancel\n3. Click 'Cancel Order'\n\nNote: Orders can only be cancelled if they haven't been confirmed by the vendor yet.",
    options: [
      { id: "how_to_cancel", text: "How to cancel step by step" },
      { id: "refund_policy", text: "Refund policy" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  payment_failed: {
    message: "Payment failed? Here are common solutions:\n\n1. Check your payment method\n2. Ensure sufficient funds\n3. Try a different payment method\n4. Contact your bank if needed\n\nWhat would you like to try?",
    options: [
      { id: "retry_payment", text: "Retry payment" },
      { id: "change_payment", text: "Change payment method" },
      { id: "contact_support", text: "Contact support" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  refund_request: {
    message: "To request a refund:\n\n1. Go to your order history\n2. Select the order\n3. Click 'Request Refund'\n4. Provide reason for refund\n\nRefunds are processed within 3-5 business days.",
    options: [
      { id: "refund_status", text: "Check refund status" },
      { id: "refund_policy", text: "Refund policy details" },
      { id: "contact_support", text: "Contact support" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  double_charged: {
    message: "I'm sorry you were double charged. This is a serious issue that we'll resolve immediately.\n\nPlease provide:\n1. Order number\n2. Transaction details\n3. Screenshot of charges\n\nWe'll process your refund within 24 hours.",
    options: [
      { id: "provide_details", text: "Provide transaction details" },
      { id: "contact_support", text: "Contact support immediately" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  payment_method: {
    message: "To change your payment method:\n\n1. Go to your profile settings\n2. Select 'Payment Methods'\n3. Add new payment method\n4. Set as default\n\nYou can use: Credit/Debit cards, UPI, or Cash on Delivery.",
    options: [
      { id: "add_payment", text: "Add new payment method" },
      { id: "payment_options", text: "Available payment options" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  damaged_items: {
    message: "I'm sorry your items arrived damaged. Here's what to do:\n\n1. Don't accept the delivery if items are visibly damaged\n2. Take photos of the damage\n3. Contact the vendor immediately\n4. We'll arrange for replacement or refund\n\nWhat would you like to do?",
    options: [
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "request_replacement", text: "Request replacement" },
      { id: "request_refund", text: "Request refund" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  expired_items: {
    message: "Expired items are unacceptable. Here's our policy:\n\n• We guarantee fresh products\n• Expired items are eligible for full refund\n• We'll investigate with the vendor\n• You may receive compensation\n\nWhat would you like to do?",
    options: [
      { id: "request_refund", text: "Request full refund" },
      { id: "report_vendor", text: "Report vendor" },
      { id: "contact_support", text: "Contact support" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  missing_items: {
    message: "Missing items from your order? Let's resolve this:\n\n1. Check your order details\n2. Contact the vendor\n3. We'll arrange for missing items\n4. Or provide refund for missing items\n\nWhat would you prefer?",
    options: [
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "request_missing", text: "Request missing items" },
      { id: "refund_missing", text: "Refund for missing items" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  quality_issue: {
    message: "Poor quality items? We take quality seriously:\n\n1. Contact the vendor with details\n2. Take photos of quality issues\n3. We'll investigate and take action\n4. You may receive refund or replacement\n\nHow would you like to proceed?",
    options: [
      { id: "contact_vendor", text: "Contact vendor" },
      { id: "request_refund", text: "Request refund" },
      { id: "report_quality", text: "Report quality issue" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  vendor_contact: {
    message: "To get vendor contact details:\n\n1. Go to the vendor's shop page\n2. Click on 'Contact Vendor'\n3. You'll see their phone number and shop address\n4. You can also message them through the app\n\nWould you like help finding a specific vendor?",
    options: [
      { id: "find_vendor", text: "Find vendor" },
      { id: "vendor_list", text: "Browse vendors" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  vendor_complaint: {
    message: "To file a vendor complaint:\n\n1. Go to your order history\n2. Select the problematic order\n3. Click 'File Complaint'\n4. Provide detailed complaint\n5. We'll investigate within 24 hours\n\nWould you like to file a complaint now?",
    options: [
      { id: "file_complaint", text: "File complaint" },
      { id: "complaint_status", text: "Check complaint status" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  },
  
  vendor_feedback: {
    message: "We value your feedback! To give vendor feedback:\n\n1. Go to your order history\n2. Select the order\n3. Click 'Rate & Review'\n4. Rate the vendor and leave feedback\n5. Your feedback helps other customers\n\nWould you like to leave feedback?",
    options: [
      { id: "leave_feedback", text: "Leave feedback" },
      { id: "view_reviews", text: "View vendor reviews" },
      { id: "back_to_main", text: "← Back to main menu" }
    ]
  }
};

// Handle customer message
const handleMessage = async (req, res) => {
  try {
    const { message, customer_id, session_id } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Check if message is a menu selection (number or option id)
    let selectedOption = null;
    
    // Check for numeric selection (1, 2, 3, 4)
    if (/^[1-4]$/.test(message.trim())) {
      const optionMap = {
        '1': 'order_trouble',
        '2': 'payment_issue', 
        '3': 'items_issue',
        '4': 'vendor_care'
      };
      selectedOption = optionMap[message.trim()];
    }
    // Check for option IDs
    else if (chatbotMenus[message.toLowerCase()] || issueResponses[message.toLowerCase()]) {
      selectedOption = message.toLowerCase();
    }
    // Check for "back" or "main" commands
    else if (message.toLowerCase().includes('back') || message.toLowerCase().includes('main')) {
      selectedOption = 'main';
    }
    // Check for "help" or "menu" commands
    else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('menu')) {
      selectedOption = 'main';
    }

    let response;

    if (selectedOption) {
      // Handle menu navigation
      if (chatbotMenus[selectedOption]) {
        response = chatbotMenus[selectedOption];
      } else if (issueResponses[selectedOption]) {
        response = issueResponses[selectedOption];
      } else {
        // Fallback to main menu
        response = chatbotMenus.main;
      }
    } else {
      // Handle free text - provide main menu
      response = {
        message: "I understand you said: '" + message + "'. Let me help you with our support options:",
        options: chatbotMenus.main.options
      };
    }

    // Add session tracking info
    const botResponse = {
      success: true,
      message: response.message,
      options: response.options,
      session_id: session_id || Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    res.status(200).json(botResponse);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      options: [
        { id: "main", text: "← Back to main menu" }
      ]
    });
  }
};

// Get chatbot status
const getChatbotStatus = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Community Cart Support Bot is online and ready to help!',
      status: 'active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot status error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to get chatbot status'
    });
  }
};

module.exports = {
  handleMessage,
  getChatbotStatus
};
