// Orbit D2C Platform Mock Data
// Brand: Aura Studios (Contemporary Linen & Everyday Apparel)

export const INITIAL_CHANNELS = [
  {
    id: 'shopify',
    name: 'Shopify Storefront',
    type: 'shopify',
    status: 'connected',
    ordersToday: 24,
    revenueToday: 184500,
    latency: '110ms',
    lastSync: 'Just now',
    autoSync: true,
    webhookUrl: 'https://api.orbitops.io/v1/webhooks/shopify_aura',
    storeUrl: 'https://aurastudios.in'
  },
  {
    id: 'instagram',
    name: 'Instagram / Meta Shop',
    type: 'instagram',
    status: 'connected',
    ordersToday: 11,
    revenueToday: 74200,
    latency: '190ms',
    lastSync: '1 min ago',
    autoSync: true,
    webhookUrl: 'https://api.orbitops.io/v1/webhooks/ig_aura',
    storeUrl: 'https://instagram.com/aurastudios.in'
  },
  {
    id: 'marketplace',
    name: 'Amazon & Myntra Marketplace',
    type: 'marketplace',
    status: 'connected',
    ordersToday: 18,
    revenueToday: 98600,
    latency: '165ms',
    lastSync: '3 mins ago',
    autoSync: true,
    webhookUrl: 'https://api.orbitops.io/v1/webhooks/marketplaces',
    storeUrl: 'https://amazon.in/shops/aura-studios'
  },
  {
    id: 'pos',
    name: 'Indiranagar Flagship POS',
    type: 'pos',
    status: 'connected',
    ordersToday: 7,
    revenueToday: 26950,
    latency: '45ms',
    lastSync: 'Realtime (LAN)',
    autoSync: true,
    webhookUrl: 'https://api.orbitops.io/v1/webhooks/pos_bengaluru',
    storeUrl: 'Terminal #01 — Indiranagar 100ft Rd'
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'SKU-LIN-001',
    name: 'Bespoke Linen Overshirt - Sand',
    category: 'Tops',
    unitPrice: 3499,
    costPrice: 1200,
    threshold: 15,
    channels: {
      shopify: 28,
      instagram: 12,
      marketplace: 16,
      pos: 6
    },
    totalAvailable: 62,
    hsn: '6205',
    gstRate: 12,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-1', timestamp: '10:14 AM', delta: -1, channel: 'shopify', reason: 'Order #ORD-4528', staff: 'System' },
      { id: 'm-2', timestamp: '09:40 AM', delta: -2, channel: 'marketplace', reason: 'Order #ORD-4525', staff: 'System' },
      { id: 'm-3', timestamp: 'Yesterday', delta: +50, channel: 'pos', reason: 'PO-2024-089 Restock', staff: 'Arjun M.' },
      { id: 'm-4', timestamp: '2 days ago', delta: -1, channel: 'pos', reason: 'POS Receipt #8812', staff: 'Ravi K.' }
    ]
  },
  {
    id: 'SKU-DRS-004',
    name: 'Flora Midi Wrap Dress - Olive',
    category: 'Dresses',
    unitPrice: 4299,
    costPrice: 1550,
    threshold: 20,
    channels: {
      shopify: 4,
      instagram: 2,
      marketplace: 0,
      pos: 2
    },
    totalAvailable: 8, // Low Stock Alert
    hsn: '6204',
    gstRate: 12,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-5', timestamp: '10:02 AM', delta: -1, channel: 'instagram', reason: 'Order #ORD-4527', staff: 'System' },
      { id: 'm-6', timestamp: '08:15 AM', delta: -3, channel: 'shopify', reason: 'Order #ORD-4520', staff: 'System' },
      { id: 'm-7', timestamp: 'Yesterday', delta: -2, channel: 'marketplace', reason: 'Order #ORD-4511', staff: 'System' }
    ]
  },
  {
    id: 'SKU-TRS-009',
    name: 'Pleated Tapered Linen Trousers',
    category: 'Bottoms',
    unitPrice: 2899,
    costPrice: 950,
    threshold: 12,
    channels: {
      shopify: 35,
      instagram: 18,
      marketplace: 22,
      pos: 10
    },
    totalAvailable: 85,
    hsn: '6203',
    gstRate: 12,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-8', timestamp: '10:18 AM', delta: -1, channel: 'shopify', reason: 'Order #ORD-4529', staff: 'System' },
      { id: 'm-9', timestamp: 'Yesterday', delta: +100, channel: 'pos', reason: 'Batch 12 Factory Intake', staff: 'Arjun M.' }
    ]
  },
  {
    id: 'SKU-ACC-012',
    name: 'Handcrafted Vegetable-Tan Belt',
    category: 'Accessories',
    unitPrice: 1999,
    costPrice: 620,
    threshold: 10,
    channels: {
      shopify: 1,
      instagram: 1,
      marketplace: 0,
      pos: 1
    },
    totalAvailable: 3, // Severe Low Stock
    hsn: '4203',
    gstRate: 18,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-10', timestamp: '09:12 AM', delta: -1, channel: 'pos', reason: 'Walk-in Store Purchase', staff: 'Ravi K.' },
      { id: 'm-11', timestamp: 'Yesterday', delta: -2, channel: 'shopify', reason: 'Order #ORD-4518', staff: 'System' }
    ]
  },
  {
    id: 'SKU-JKT-003',
    name: 'Indigo Washed Kimono Jacket',
    category: 'Outerwear',
    unitPrice: 5499,
    costPrice: 2100,
    threshold: 15,
    channels: {
      shopify: 18,
      instagram: 8,
      marketplace: 12,
      pos: 5
    },
    totalAvailable: 43,
    hsn: '6201',
    gstRate: 12,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-12', timestamp: '10:10 AM', delta: -1, channel: 'shopify', reason: 'Order #ORD-4528', staff: 'System' }
    ]
  },
  {
    id: 'SKU-TEE-002',
    name: 'Organic Slub Cotton Tee - Oatmeal',
    category: 'Tops',
    unitPrice: 1499,
    costPrice: 420,
    threshold: 30,
    channels: {
      shopify: 52,
      instagram: 24,
      marketplace: 45,
      pos: 18
    },
    totalAvailable: 139,
    hsn: '6109',
    gstRate: 5,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    movements: [
      { id: 'm-13', timestamp: '10:15 AM', delta: -2, channel: 'instagram', reason: 'Order #ORD-4529', staff: 'System' }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-4529',
    orderNumber: '#4529',
    customer: {
      name: 'Aditi Sharma',
      email: 'aditi.s@gmail.com',
      phone: '+91 98450 12891',
      city: 'Bengaluru, KA',
      pincode: '560038'
    },
    channel: 'shopify',
    status: 'placed',
    items: [
      { sku: 'SKU-TRS-009', name: 'Pleated Tapered Linen Trousers', qty: 1, price: 2899 },
      { sku: 'SKU-TEE-002', name: 'Organic Slub Cotton Tee - Oatmeal', qty: 2, price: 1499 }
    ],
    subtotal: 5897,
    gst: 563,
    shipping: 0,
    total: 5897,
    placedAt: '4 mins ago',
    timestamp: Date.now() - 4 * 60 * 1000,
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    priority: 'high',
    tags: ['Express Delivery', 'First Time Customer'],
    tracking: null,
    presence: ['Arjun M.']
  },
  {
    id: 'ORD-4528',
    orderNumber: '#4528',
    customer: {
      name: 'Rohan Mehra',
      email: 'rohan.m@outlook.com',
      phone: '+91 99201 44521',
      city: 'Mumbai, MH',
      pincode: '400050'
    },
    channel: 'instagram',
    status: 'packed',
    items: [
      { sku: 'SKU-LIN-001', name: 'Bespoke Linen Overshirt - Sand', qty: 1, price: 3499 },
      { sku: 'SKU-JKT-003', name: 'Indigo Washed Kimono Jacket', qty: 1, price: 5499 }
    ],
    subtotal: 8998,
    gst: 964,
    shipping: 0,
    total: 8998,
    placedAt: '22 mins ago',
    timestamp: Date.now() - 22 * 60 * 1000,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    priority: 'medium',
    tags: ['VIP Client'],
    tracking: 'DELHIVERY_BOM_998124',
    presence: []
  },
  {
    id: 'ORD-4527',
    orderNumber: '#4527',
    customer: {
      name: 'Dr. Sneha Pillai',
      email: 'sneha.pillai@aiims.edu',
      phone: '+91 97112 88203',
      city: 'New Delhi, DL',
      pincode: '110029'
    },
    channel: 'shopify',
    status: 'shipped',
    items: [
      { sku: 'SKU-DRS-004', name: 'Flora Midi Wrap Dress - Olive', qty: 1, price: 4299 }
    ],
    subtotal: 4299,
    gst: 460,
    shipping: 150,
    total: 4449,
    placedAt: '1 hour ago',
    timestamp: Date.now() - 65 * 60 * 1000,
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    priority: 'medium',
    tags: ['Gift Box Packaging'],
    tracking: 'BLUEDART_DEL_771249',
    presence: ['Meera S.']
  },
  {
    id: 'ORD-4526',
    orderNumber: '#4526',
    customer: {
      name: 'Karan Singhal',
      email: 'karan@singhalenterprises.com',
      phone: '+91 94140 33819',
      city: 'Jaipur, RJ',
      pincode: '302001'
    },
    channel: 'marketplace',
    status: 'delivered',
    items: [
      { sku: 'SKU-LIN-001', name: 'Bespoke Linen Overshirt - Sand', qty: 2, price: 3499 }
    ],
    subtotal: 6998,
    gst: 750,
    shipping: 0,
    total: 6998,
    placedAt: '3 hours ago',
    timestamp: Date.now() - 180 * 60 * 1000,
    paymentMethod: 'Amazon Pay',
    paymentStatus: 'Settled',
    priority: 'low',
    tags: ['Prime Dispatch'],
    tracking: 'AMZN_LOG_994112',
    presence: []
  },
  {
    id: 'ORD-4525',
    orderNumber: '#4525',
    customer: {
      name: 'Pooja Venkatesh',
      email: 'pooja.v@tcs.com',
      phone: '+91 98840 91823',
      city: 'Chennai, TN',
      pincode: '600028'
    },
    channel: 'pos',
    status: 'delivered',
    items: [
      { sku: 'SKU-ACC-012', name: 'Handcrafted Vegetable-Tan Belt', qty: 1, price: 1999 }
    ],
    subtotal: 1999,
    gst: 305,
    shipping: 0,
    total: 1999,
    placedAt: '5 hours ago',
    timestamp: Date.now() - 300 * 60 * 1000,
    paymentMethod: 'PineLabs Card POS',
    paymentStatus: 'Paid',
    priority: 'low',
    tags: ['Store Walk-in'],
    tracking: 'IN_STORE_RECEIPT',
    presence: []
  },
  {
    id: 'ORD-4524',
    orderNumber: '#4524',
    customer: {
      name: 'Vikram Joshi',
      email: 'vikram.j@techcorp.in',
      phone: '+91 98200 77112',
      city: 'Pune, MH',
      pincode: '411006'
    },
    channel: 'shopify',
    status: 'returned',
    items: [
      { sku: 'SKU-LIN-001', name: 'Bespoke Linen Overshirt - Sand', qty: 1, price: 3499 }
    ],
    subtotal: 3499,
    gst: 375,
    shipping: 0,
    total: 3499,
    placedAt: 'Yesterday',
    timestamp: Date.now() - 1440 * 60 * 1000,
    paymentMethod: 'Razorpay NetBanking',
    paymentStatus: 'Refund Pending',
    priority: 'medium',
    tags: ['Size Exchange', 'Reverse Pickup Scheduled'],
    tracking: 'SHIPROCKET_REV_11823',
    presence: []
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2024-0418',
    invoiceNumber: 'INV-0418',
    orderNumber: '#4529',
    customer: 'Aditi Sharma',
    channel: 'shopify',
    date: '2026-09-24',
    dueDate: '2026-09-24',
    status: 'Draft',
    subtotal: 5334,
    cgst: 281.5,
    sgst: 281.5,
    igst: 0,
    total: 5897,
    reconciliationStatus: 'Matched',
    gatewayRef: 'pay_N8mKx991'
  },
  {
    id: 'INV-2024-0417',
    invoiceNumber: 'INV-0417',
    orderNumber: '#4528',
    customer: 'Rohan Mehra',
    channel: 'instagram',
    date: '2026-09-24',
    dueDate: '2026-09-24',
    status: 'Sent',
    subtotal: 8034,
    cgst: 0,
    sgst: 0,
    igst: 964,
    total: 8998,
    reconciliationStatus: 'Matched',
    gatewayRef: 'meta_pay_88192'
  },
  {
    id: 'INV-2024-0416',
    invoiceNumber: 'INV-0416',
    orderNumber: '#4527',
    customer: 'Dr. Sneha Pillai',
    channel: 'shopify',
    date: '2026-09-24',
    dueDate: '2026-09-24',
    status: 'Reconciled',
    subtotal: 3989,
    cgst: 0,
    sgst: 0,
    igst: 460,
    total: 4449,
    reconciliationStatus: 'Matched',
    gatewayRef: 'pay_N7Lpz330'
  },
  {
    id: 'INV-2024-0415',
    invoiceNumber: 'INV-0415',
    orderNumber: '#4526',
    customer: 'Karan Singhal',
    channel: 'marketplace',
    date: '2026-09-23',
    dueDate: '2026-09-30',
    status: 'Reconciled',
    subtotal: 6248,
    cgst: 0,
    sgst: 0,
    igst: 750,
    total: 6998,
    reconciliationStatus: 'Discrepancy', // ₹85 Amazon deduction mismatch
    discrepancyAmount: -85,
    discrepancyReason: 'Marketplace TDS withholding discrepancy',
    gatewayRef: 'amzn_settle_0081'
  },
  {
    id: 'INV-2024-0414',
    invoiceNumber: 'INV-0414',
    orderNumber: '#4525',
    customer: 'Pooja Venkatesh',
    channel: 'pos',
    date: '2026-09-23',
    dueDate: '2026-09-23',
    status: 'Reconciled',
    subtotal: 1694,
    cgst: 152.5,
    sgst: 152.5,
    igst: 0,
    total: 1999,
    reconciliationStatus: 'Matched',
    gatewayRef: 'pine_pos_tx_0019'
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    time: '2 mins ago',
    type: 'sale',
    channel: 'shopify',
    title: 'New Order #4529 received',
    description: 'Aditi Sharma placed an order for ₹5,897 (2 items). Live stock automatically reserved.'
  },
  {
    id: 'act-2',
    time: '12 mins ago',
    type: 'sync',
    channel: 'instagram',
    title: 'Instagram Catalog Synced',
    description: '14 SKUs updated across Meta Commerce catalog with 0 drift.'
  },
  {
    id: 'act-3',
    time: '24 mins ago',
    type: 'fulfillment',
    channel: 'shopify',
    title: 'Order #4528 marked Packed',
    description: 'Arjun verified barcode scan; Delhivery airway bill #DELHIVERY_BOM_998124 generated.'
  },
  {
    id: 'act-4',
    time: '45 mins ago',
    type: 'alert',
    channel: 'shopify',
    title: 'Low Stock Alert: Handcrafted Belt',
    description: 'Stock dropped below reorder threshold (3 left vs 10 threshold). Restock PO recommended.'
  },
  {
    id: 'act-5',
    time: '1 hour ago',
    type: 'accounting',
    channel: 'marketplace',
    title: 'Amazon Payout Reconciled with Note',
    description: '₹6,913 received against INV-0415; ₹85 variance flagged for Meera S.'
  }
];

export const TEAM_MEMBERS = [
  {
    id: 'u-1',
    name: 'Priya Sharma',
    role: 'Founder / CEO',
    email: 'priya@aurastudios.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    color: '#D9A72E',
    status: 'online',
    currentFocus: 'Reviewing Q3 Revenue & GST'
  },
  {
    id: 'u-2',
    name: 'Arjun Mathur',
    role: 'Operations Manager',
    email: 'arjun@aurastudios.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    color: '#3E7C59',
    status: 'online',
    currentFocus: 'Processing Orders Kanban'
  },
  {
    id: 'u-3',
    name: 'Meera Srinivasan',
    role: 'Head of Finance',
    email: 'meera@aurastudios.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    color: '#3D5AFE',
    status: 'busy',
    currentFocus: 'Reconciling Marketplace Settlements'
  },
  {
    id: 'u-4',
    name: 'Ravi Kumar',
    role: 'Warehouse Lead',
    email: 'ravi@aurastudios.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    color: '#B8730C',
    status: 'active-tablet',
    currentFocus: 'Packing station #2 (Scanning barcodes)'
  }
];
