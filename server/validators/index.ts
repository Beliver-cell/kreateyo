import { z } from 'zod';

export const licenseValidationSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
  deviceFingerprint: z.string().optional(),
});

export const generateLicenseSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  digitalProductId: z.string().uuid('Invalid product ID'),
  customerEmail: z.string().email('Invalid email'),
  customerOrderId: z.string().optional(),
  customSettings: z.object({
    maxDownloads: z.number().optional(),
    maxActivations: z.number().optional(),
  }).optional(),
});

export const createDownloadLinkSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
});

export const orderNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  orderId: z.string().min(1, 'Order ID is required'),
  notificationType: z.enum(['order_placed', 'order_shipped', 'order_delivered', 'order_cancelled']),
  customerEmail: z.string().email('Invalid email'),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

export const processLeadsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  leadIds: z.array(z.string().uuid()).min(1, 'At least one lead ID required'),
  action: z.enum(['qualify', 'disqualify', 'contact', 'convert']),
});

export const leadWebhookSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  platform: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const importProductsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  supplierId: z.string().uuid('Invalid supplier ID'),
  products: z.array(z.object({
    externalId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.string(),
    cost: z.string(),
    images: z.array(z.string()).optional(),
    variants: z.array(z.any()).optional(),
  })),
});

export const syncInventorySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  supplierId: z.string().uuid('Invalid supplier ID'),
});

export const supplierConnectSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  name: z.string().min(1, 'Supplier name is required'),
  platform: z.string().min(1, 'Platform is required'),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  storeUrl: z.string().url().optional(),
  settings: z.record(z.any()).optional(),
});

export const autoOrderProcessSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  supplierId: z.string().uuid('Invalid supplier ID'),
  customerOrderId: z.string(),
  importedProductId: z.string().uuid().optional(),
  orderDetails: z.record(z.any()).optional(),
});

export const aiOutreachSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  leadId: z.string().uuid('Invalid lead ID'),
  templateId: z.string().uuid().optional(),
  context: z.record(z.any()).optional(),
});

export const generateEmailContentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  emailType: z.string(),
  context: z.record(z.any()).optional(),
  variables: z.record(z.any()).optional(),
});

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}
