import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRoute } from './routes/auth';
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
import { notificationsRoute } from './routes/notifications';
import { dataRoute } from './routes/data';
import businessesRoute from './routes/businesses';
import { chatRoute } from './routes/chat';
import { templatesRoute } from './routes/templates';
import { yopayRoute, yopayDashboardRoute } from './routes/yopay';
import { affiliatesRoute } from './routes/affiliates';
import { setupChatSocket } from './sockets/chat';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api', authRoute);
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
app.use('/api', notificationsRoute);
app.use('/api', dataRoute);
app.use('/api/businesses', businessesRoute);
app.use('/api/businesses', yopayDashboardRoute);
app.use('/api/chat', chatRoute);
app.use('/api/templates', templatesRoute);
app.use('/api/yopay', yopayRoute);
app.use('/api', affiliatesRoute);

app.use(notFoundHandler);
app.use(errorHandler);

setupChatSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.IO ready for real-time connections');
});

export { io };
