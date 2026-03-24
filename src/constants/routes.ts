/**
 * Centralized route path constants.
 * Use these instead of hardcoding path strings throughout the app.
 */

// ── Public routes ──────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  TOOLS: "/tools",
  PLANS: "/plans",
  CART: "/cart",
  WISHLIST: "/wishlist",
  SEARCH: "/search",
  COMPANY: "/company",
  HELP: "/help",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  SHIPPING: "/shipping",
  RETURNS: "/returns",
  NEWSLETTER: "/newsletter",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  STAFF_LOGIN: "/auth/staff/login",

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_PRODUCTS: "/dashboard/products",
  DASHBOARD_TOOLS: "/dashboard/tools",
  DASHBOARD_ORDERS: "/dashboard/orders",
  DASHBOARD_SUBSCRIPTION: "/dashboard/subscription",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_PAYMENT: "/dashboard/payment",
  DASHBOARD_ADDRESSES: "/dashboard/addresses",

  // Admin
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_TOOLS: "/admin/tools",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_SUBSCRIPTIONS: "/admin/subscriptions",
  ADMIN_MARKETING: "/admin/marketing",
  ADMIN_SETTINGS: "/admin/settings",

  // Checkout
  CHECKOUT_SUCCESS: "/checkout/success",
} as const;

// ── API routes ─────────────────────────────────────────────────────
export const API_ROUTES = {
  AUTH: "/api/auth",
  REGISTER: "/api/auth/register",
  PRODUCTS: "/api/products",
  CART_PREVIEW: "/api/cart/preview",
  CHECKOUT_SESSION: "/api/checkout/create-session",
  CHECKOUT_SUBSCRIPTION: "/api/checkout/subscription",
  BILLING_PORTAL: "/api/billing/portal",
  WISHLIST: "/api/wishlist",
  ME: "/api/me",
  NEWSLETTER: "/api/newsletter/subscribe",
  UPLOAD_IMAGE: "/api/upload/image",
  ORDERS: "/api/orders",
  SETTINGS_ANNOUNCEMENTS: "/api/settings/announcements",
} as const;
