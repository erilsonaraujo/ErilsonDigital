import { createMercadoPagoGateway } from '@/src/ecommerce/providers/mercadopago';
import { createStripeGateway } from '@/src/ecommerce/providers/stripe';
import { createPayPalGateway } from '@/src/ecommerce/providers/paypal';

export function getPaymentGateway(provider: 'mercadopago' | 'stripe' | 'paypal') {
  if (provider === 'mercadopago') return createMercadoPagoGateway();
  if (provider === 'stripe') return createStripeGateway();
  if (provider === 'paypal') return createPayPalGateway();
  throw new Error('Unsupported provider');
}
