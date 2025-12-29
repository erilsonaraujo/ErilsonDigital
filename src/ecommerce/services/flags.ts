export function isEcommerceEnabled() {
  return process.env.ECOMMERCE_ENABLED === 'true';
}

export function isEcommerceAdminEnabled() {
  return process.env.ECOMMERCE_ADMIN_ENABLED === 'true';
}
