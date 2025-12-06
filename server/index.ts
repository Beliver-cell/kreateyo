import express from 'express';
import cors from 'cors';
import { validateLicenseRoute } from './routes/validate-license';
import { generateLicenseRoute } from './routes/generate-license';
import { createDownloadLinkRoute } from './routes/create-download-link';
import { sendDigitalProductRoute } from './routes/send-digital-product';
import { sendOrderNotificationRoute } from './routes/send-order-notification';
import { processLeadsRoute } from './routes/process-leads';
import { leadWebhookRoute } from './routes/lead-webhook';
import { importProductsRoute } from './routes/import-products';
import { syncInventoryRoute } from './routes/sync-inventory';
import { supplierConnectRoute } from './routes/supplier-connect';
import { autoOrderProcessRoute } from './routes/auto-order-process';
import { aiOutreachRoute } from './routes/ai-outreach';
import { generateEmailContentRoute } from './routes/generate-email-content';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api', validateLicenseRoute);
app.use('/api', generateLicenseRoute);
app.use('/api', createDownloadLinkRoute);
app.use('/api', sendDigitalProductRoute);
app.use('/api', sendOrderNotificationRoute);
app.use('/api', processLeadsRoute);
app.use('/api', leadWebhookRoute);
app.use('/api', importProductsRoute);
app.use('/api', syncInventoryRoute);
app.use('/api', supplierConnectRoute);
app.use('/api', autoOrderProcessRoute);
app.use('/api', aiOutreachRoute);
app.use('/api', generateEmailContentRoute);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
