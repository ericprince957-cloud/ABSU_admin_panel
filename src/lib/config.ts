// Site configuration - shared with marketplace
export const config = {
  siteName: 'CampusMarket',
  siteTagline: 'Student Marketplace',
  currency: '₦',
  currencyCode: 'NGN',
  whatsappCheckout: true,
  platformOwnerWhatsApp: '+2348012345678',
  dataVersion: '1.0.0',
};

// LocalStorage keys - MUST match marketplace exactly
export const STORAGE_KEYS = {
  USERS: 'campusmarket_users',
  PRODUCTS: 'campusmarket_products',
  ORDERS: 'campusmarket_orders',
  DATA_VERSION: 'campusmarket_data_version',
  INITIALIZED: 'campusmarket_initialized',
};
