import React, { useState, useRef, useEffect, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import './HelpChatbot.css';

const HelpChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "👋 Hi! I'm your shopping assistant. How can I help you today?",
            options: [
                { id: 'orders', label: '📦 My Orders', icon: '📦' },
                { id: 'delivery', label: '🚚 Delivery Info', icon: '🚚' },
                { id: 'cancel', label: '❌ Cancel Order', icon: '❌' },
                { id: 'report_issue', label: '🎫 Report Issue', icon: '🎫' },
                { id: 'refund', label: '💰 Refund Status', icon: '💰' },
                { id: 'contact', label: '📞 Contact Support', icon: '📞' },
            ],
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const messagesEndRef = useRef(null);
    const { url, token, userData } = useContext(StoreContext);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch chat history
    const fetchChatHistory = async () => {
        if (!token) return;
        try {
            const response = await axios.post(
                `${url}/api/chat/userchat`,
                {},
                { headers: { token } }
            );

            if (response.data.success && response.data.data) {
                const backendMessages = response.data.data.messages.map(msg => ({
                    type: msg.sender === 'user' ? 'user' : 'bot',
                    text: msg.text
                }));

                // Only update if we have new messages or initial load (simple check)
                if (backendMessages.length > 0) {
                    setMessages(prev => {
                        // Merge strategy: Keep the initial bot welcome, append backend messages. 
                        // To avoid duplication if we already have them, we could check IDs, but valid approach for now:
                        // Just reset to [Welcome] + [Backend].
                        return [
                            {
                                type: 'bot',
                                text: "👋 Hi! I'm your shopping assistant. How can I help you today?",
                                options: [
                                    { id: 'orders', label: '📦 My Orders', icon: '📦' },
                                    { id: 'delivery', label: '🚚 Delivery Info', icon: '🚚' },
                                    { id: 'cancel', label: '❌ Cancel Order', icon: '❌' },
                                    { id: 'report_issue', label: '🎫 Report Issue', icon: '🎫' },
                                    { id: 'refund', label: '💰 Refund Status', icon: '💰' },
                                    { id: 'contact', label: '📞 Contact Support', icon: '📞' },
                                ],
                            },
                            ...backendMessages
                        ];
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching chat history", error);
        }
    }

    // Fetch user orders and chat history when chat opens
    useEffect(() => {
        if (isOpen && token) {
            fetchUserOrders();
            fetchChatHistory();

            // Poll for new messages every 5 seconds
            const interval = setInterval(fetchChatHistory, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, token]);

    const fetchUserOrders = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            setUserOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const saveMessageToBackend = async (text, sender, metaData = {}) => {
        if (!token) return;
        try {
            await axios.post(
                `${url}/api/chat/save`,
                {
                    text,
                    sender,
                    userName: userData?.name || "Customer",
                    orderId: metaData.orderId || selectedOrderId, // Use passed ID or current state
                    issueType: metaData.issueType
                },
                { headers: { token } }
            );
        } catch (error) {
            console.error("Error saving message", error);
        }
    };

    const addBotMessage = (text, options = null, delay = 1000) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages((prev) => [...prev, { type: 'bot', text, options }]);
            setIsTyping(false);
            // We generally don't save local bot auto-responses to backend to avoid clutter, 
            // but we could if we wanted to allow admin to see the full flow.
            // For now, let's only save user messages and admin replies (fetched from backend).
        }, delay);
    };

    const addUserMessage = (text, metaData = {}) => {
        setMessages((prev) => [...prev, { type: 'user', text }]);
        saveMessageToBackend(text, 'user', metaData);
    };

    const handleOptionClick = (optionId) => {
        switch (optionId) {
            case 'orders':
                addUserMessage('I want to check my orders', { issueType: 'Order Inquiry' });
                handleOrdersQuery();
                break;
            case 'delivery':
                addUserMessage('I have a delivery question', { issueType: 'Delivery' });
                handleDeliveryQuery();
                break;
            case 'cancel':
                addUserMessage('I want to cancel an order', { issueType: 'Cancellation' });
                handleCancelQuery();
                break;
            case 'refund':
                addUserMessage('I want to check my refund status', { issueType: 'Refund' });
                handleRefundQuery();
                break;
            case 'contact':
                addUserMessage('I need to contact support');
                handleContactQuery();
                break;
            case 'back_main':
                addUserMessage('Back to main menu');
                showMainMenu();
                break;
            case 'delivery_time':
                addUserMessage('What is the delivery time?');
                addBotMessage(
                    "🚚 **Delivery Timeline:**\n\n• **Standard Delivery:** 3-5 business days\n• **Express Delivery:** 1-2 business days\n• **Same Day Delivery:** Available in select cities\n\nDelivery times may vary based on your location and product availability.",
                    [{ id: 'track_order', label: '📍 Track My Order' }, { id: 'back_main', label: '🏠 Main Menu' }]
                );
                break;
            case 'delivery_charges':
                addUserMessage('What are the delivery charges?');
                addBotMessage(
                    "💰 **Delivery Charges:**\n\n• **Free Delivery:** On orders above ₹500\n• **Standard Rate:** ₹5 for orders below ₹500\n\nNo hidden charges! What else can I help you with?",
                    [{ id: 'back_main', label: '🏠 Main Menu' }]
                );
                break;
            case 'track_order':
                addUserMessage('I want to track my order');
                handleTrackOrder();
                break;
            case 'cancel_policy':
                addUserMessage('What is the cancellation policy?');
                addBotMessage(
                    "📋 **Cancellation Policy:**\n\n• Orders can be cancelled before they are shipped\n• Once shipped, cancellation is not possible\n• Refund will be processed within 5-7 business days\n• COD orders can be cancelled anytime before delivery",
                    [{ id: 'cancel_order', label: '❌ Cancel My Order' }, { id: 'back_main', label: '🏠 Main Menu' }]
                );
                break;
            case 'cancel_order':
                addUserMessage('I want to cancel my order');
                handleCancelOrder();
                break;
            case 'refund_timeline':
                addUserMessage('How long does refund take?');
                addBotMessage(
                    "⏱️ **Refund Timeline:**\n\n• **UPI/Cards:** 5-7 business days\n• **Net Banking:** 7-10 business days\n• **COD:** Not applicable (no refund needed)\n\nRefund will be credited to the original payment method.",
                    [{ id: 'check_refund', label: '🔍 Check Refund Status' }, { id: 'back_main', label: '🏠 Main Menu' }]
                );
                break;
            case 'check_refund':
                addUserMessage('Check my refund status');
                handleCheckRefund();
                break;
            case 'report_issue':
                addUserMessage('I want to report an issue', { issueType: 'Support Ticket' });
                addBotMessage(
                    "🎫 **Raise a Ticket:**\n\nPlease describe your issue in detail below. Our support team will review it and get back to you shortly.\n\n(e.g., 'Received damaged product', 'Payment failed but deducted')",
                    [{ id: 'back_main', label: '🏠 Main Menu' }]
                );
                break;

            default:
                if (optionId.startsWith('order_')) {
                    const orderId = optionId.replace('order_', '');
                    handleSelectOrder(orderId);
                } else if (optionId.startsWith('cancel_confirm_')) {
                    const orderId = optionId.replace('cancel_confirm_', '');
                    addUserMessage(`I want to cancel order ${orderId}`, { orderId, issueType: 'Cancellation' });
                    handleConfirmCancel(orderId);
                }
                break;
        }
    };

    const handleOrdersQuery = () => {
        if (!token) {
            addBotMessage(
                "🔐 Please log in to view your orders. You can sign in from the navigation bar.",
                [{ id: 'back_main', label: '🏠 Main Menu' }]
            );
            return;
        }

        if (userOrders.length === 0) {
            addBotMessage(
                "📭 You don't have any orders yet. Start shopping to place your first order!",
                [{ id: 'back_main', label: '🏠 Main Menu' }]
            );
        } else {
            const orderOptions = userOrders.slice(0, 5).map((order, index) => ({
                id: `order_${order._id}`,
                label: `📦 Order #${index + 1} - ₹${order.amount} (${order.status})`,
            }));
            orderOptions.push({ id: 'back_main', label: '🏠 Main Menu' });

            addBotMessage(
                `📋 You have ${userOrders.length} order(s). Select an order to view details:`,
                orderOptions
            );
        }
    };

    const handleSelectOrder = (orderId) => {
        const order = userOrders.find((o) => o._id === orderId);
        if (order) {
            setSelectedOrderId(orderId);
            const itemsList = order.items.map((item) => `• ${item.name} x ${item.quantity}`).join('\n');
            addBotMessage(
                `📦 **Order Details:**\n\n${itemsList}\n\n💰 **Total:** ₹${order.amount}\n📊 **Status:** ${order.status}\n💳 **Payment:** ${order.payment ? 'Paid' : 'Pending'}`,
                [
                    { id: 'track_order', label: '📍 Track Order' },
                    { id: order.status === 'Processing' ? 'cancel_confirm_' + orderId : 'cancel_policy', label: '❌ Cancel Order' },
                    { id: 'back_main', label: '🏠 Main Menu' },
                ]
            );
        }
    };

    const handleTrackOrder = () => {
        if (selectedOrderId) {
            const order = userOrders.find((o) => o._id === selectedOrderId);
            if (order) {
                const statusSteps = ['Processing', 'Out for Delivery', 'Delivered'];
                const currentStep = statusSteps.indexOf(order.status);
                const trackingDisplay = statusSteps
                    .map((step, index) => (index <= currentStep ? `✅ ${step}` : `⏳ ${step}`))
                    .join('\n');

                addBotMessage(
                    `📍 **Order Tracking:**\n\n${trackingDisplay}\n\n${order.status === 'Delivered' ? '🎉 Your order has been delivered!' : '📦 Your order is on its way!'}`,
                    [{ id: 'back_main', label: '🏠 Main Menu' }]
                );
                return;
            }
        }
        addBotMessage(
            "Please select an order first to track it.",
            [{ id: 'orders', label: '📦 View My Orders' }, { id: 'back_main', label: '🏠 Main Menu' }]
        );
    };

    const handleDeliveryQuery = () => {
        addBotMessage(
            "🚚 What would you like to know about delivery?",
            [
                { id: 'delivery_time', label: '⏱️ Delivery Time' },
                { id: 'delivery_charges', label: '💰 Delivery Charges' },
                { id: 'track_order', label: '📍 Track My Order' },
                { id: 'back_main', label: '🏠 Main Menu' },
            ]
        );
    };

    const handleCancelQuery = () => {
        addBotMessage(
            "❌ How can I help you with order cancellation?",
            [
                { id: 'cancel_policy', label: '📋 Cancellation Policy' },
                { id: 'cancel_order', label: '❌ Cancel My Order' },
                { id: 'back_main', label: '🏠 Main Menu' },
            ]
        );
    };

    const handleCancelOrder = () => {
        if (!token) {
            addBotMessage(
                "🔐 Please log in to cancel your orders.",
                [{ id: 'back_main', label: '🏠 Main Menu' }]
            );
            return;
        }

        const cancellableOrders = userOrders.filter((o) => o.status === 'Processing');
        if (cancellableOrders.length === 0) {
            addBotMessage(
                "📭 You don't have any orders that can be cancelled. Orders can only be cancelled while they are being processed.",
                [{ id: 'orders', label: '📦 View My Orders' }, { id: 'back_main', label: '🏠 Main Menu' }]
            );
        } else {
            const orderOptions = cancellableOrders.map((order, index) => ({
                id: `cancel_confirm_${order._id}`,
                label: `❌ Cancel Order #${index + 1} - ₹${order.amount}`,
            }));
            orderOptions.push({ id: 'back_main', label: '🏠 Main Menu' });

            addBotMessage(
                "⚠️ Select the order you want to cancel:",
                orderOptions
            );
        }
    };

    const handleConfirmCancel = async (orderId) => {
        addBotMessage("Processing your cancellation request...", null, 500);

        // In a real app, you would call the backend to cancel the order
        setTimeout(() => {
            addBotMessage(
                "✅ Your cancellation request has been submitted!\n\nOur team will process it within 24 hours. If the order was prepaid, refund will be initiated automatically.",
                [{ id: 'refund_timeline', label: '⏱️ Refund Timeline' }, { id: 'back_main', label: '🏠 Main Menu' }]
            );
            // Refresh orders
            fetchUserOrders();
        }, 1500);
    };

    const handleRefundQuery = () => {
        addBotMessage(
            "💰 How can I help you with refunds?",
            [
                { id: 'refund_timeline', label: '⏱️ Refund Timeline' },
                { id: 'check_refund', label: '🔍 Check Refund Status' },
                { id: 'back_main', label: '🏠 Main Menu' },
            ]
        );
    };

    const handleCheckRefund = () => {
        addBotMessage(
            "🔍 **Refund Status Check:**\n\nTo check your refund status, please check your bank account or UPI app transaction history. Refunds are typically credited within 5-7 business days.\n\nIf you haven't received your refund after 10 days, please contact our support team.",
            [{ id: 'contact', label: '📞 Contact Support' }, { id: 'back_main', label: '🏠 Main Menu' }]
        );
    };

    const handleContactQuery = () => {
        addBotMessage(
            "📞 **Contact Support:**\n\n📧 **Email:** support@ecomstore.com\n📱 **Phone:** +91 98765 43210\n⏰ **Hours:** Mon-Sat, 9 AM - 6 PM\n\n💬 You can also describe your issue below and we'll get back to you!",
            [{ id: 'back_main', label: '🏠 Main Menu' }]
        );
    };

    const showMainMenu = () => {
        addBotMessage(
            "How else can I help you today?",
            [
                { id: 'orders', label: '📦 My Orders', icon: '📦' },
                { id: 'delivery', label: '🚚 Delivery Info', icon: '🚚' },
                { id: 'cancel', label: '❌ Cancel Order', icon: '❌' },
                { id: 'report_issue', label: '🎫 Report Issue', icon: '🎫' },
                { id: 'refund', label: '💰 Refund Status', icon: '💰' },
                { id: 'contact', label: '📞 Contact Support', icon: '📞' },
            ]
        );
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addUserMessage(inputValue);
        const query = inputValue.toLowerCase();
        setInputValue('');

        // Simple keyword matching for natural language queries
        if (query.includes('order') && (query.includes('track') || query.includes('where') || query.includes('status'))) {
            handleOrdersQuery();
        } else if (query.includes('cancel')) {
            handleCancelQuery();
        } else if (query.includes('delivery') || query.includes('shipping')) {
            handleDeliveryQuery();
        } else if (query.includes('refund') || query.includes('money back')) {
            handleRefundQuery();
        } else if (query.includes('contact') || query.includes('support') || query.includes('help') || query.includes('human')) {
            handleContactQuery();
        } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            addBotMessage(
                "Hello! 👋 How can I assist you today?",
                [
                    { id: 'orders', label: '📦 My Orders' },
                    { id: 'delivery', label: '🚚 Delivery Info' },
                    { id: 'cancel', label: '❌ Cancel Order' },
                    { id: 'contact', label: '📞 Contact Support' },
                ]
            );
        } else {
            addBotMessage(
                "I understand you need help. Let me connect you with the right options:",
                [
                    { id: 'orders', label: '📦 Order Related' },
                    { id: 'delivery', label: '🚚 Delivery Related' },
                    { id: 'cancel', label: '❌ Cancellation' },
                    { id: 'contact', label: '📞 Talk to Support' },
                ]
            );
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle help chat"
            >
                {isOpen ? (
                    <span className="close-icon">✕</span>
                ) : (
                    <>
                        <span className="chat-icon">💬</span>
                        <span className="help-text">Help</span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div className="header-left">
                            <div className="bot-avatar">🤖</div>
                            <div className="header-info">
                                <h3>Help Assistant</h3>
                                <span className="status">
                                    <span className="status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button className="minimize-btn" onClick={() => setIsOpen(false)}>
                            −
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                {message.type === 'bot' && <div className="bot-icon">🤖</div>}
                                <div className="message-content">
                                    <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                                    {message.options && (
                                        <div className="options-container">
                                            {message.options.map((option) => (
                                                <button
                                                    key={option.id}
                                                    className="option-btn"
                                                    onClick={() => handleOptionClick(option.id)}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="bot-icon">🤖</div>
                                <div className="message-content typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleInputSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit" disabled={!inputValue.trim()}>
                            <span>➤</span>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default HelpChatbot;
