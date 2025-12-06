import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, decimal, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';

// Enums
export const appRoleEnum = pgEnum('app_role', ['owner', 'admin', 'manager', 'staff', 'viewer']);

// Users table (authentication)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  emailVerified: boolean('email_verified').default(false),
  lastSignInAt: timestamp('last_sign_in_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}));

// Sessions table (for authentication tokens)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_sessions_user_id').on(table.userId),
  tokenIdx: index('idx_sessions_token').on(table.token),
}));

// Businesses table (multi-tenant branding)
export const businesses = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  brandColor: text('brand_color').default('#6366f1'),
  secondaryColor: text('secondary_color').default('#8b5cf6'),
  description: text('description'),
  category: text('category'),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  timezone: text('timezone').default('UTC'),
  activeHours: jsonb('active_hours'),
  socialLinks: jsonb('social_links'),
  settings: jsonb('settings'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('idx_businesses_slug').on(table.slug),
  ownerIdx: index('idx_businesses_owner').on(table.ownerId),
}));

// Profiles table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  businessId: uuid('business_id').references(() => businesses.id),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User roles table
export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  role: appRoleEnum('role').notNull().default('staff'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserRole: uniqueIndex('user_roles_user_id_role_key').on(table.userId, table.role),
}));

// Team invitations table
export const teamInvitations = pgTable('team_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  role: appRoleEnum('role').notNull().default('staff'),
  invitedBy: uuid('invited_by').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  category: text('category').notNull().default('system'),
  read: boolean('read').notNull().default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Import history table
export const importHistory = pgTable('import_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull(),
  filename: text('filename').notNull(),
  status: text('status').notNull().default('pending'),
  totalRows: integer('total_rows'),
  successRows: integer('success_rows'),
  errorRows: integer('error_rows'),
  errors: jsonb('errors'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});

// API keys table
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull().unique(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
});

// Webhooks table
export const webhooks = pgTable('webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  url: text('url').notNull(),
  events: text('events').array().notNull(),
  active: boolean('active').notNull().default(true),
  secret: text('secret').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Translations table
export const translations = pgTable('translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  languageCode: text('language_code').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: uuid('resource_id').notNull(),
  fieldName: text('field_name').notNull(),
  translatedValue: text('translated_value').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueTranslation: uniqueIndex('translations_language_code_resource_type_resource_id_field_name_key')
    .on(table.languageCode, table.resourceType, table.resourceId, table.fieldName),
}));

// Support tickets table
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('open'),
  priority: text('priority').notNull().default('normal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  platform: text('platform').notNull(),
  apiKey: text('api_key'),
  apiSecret: text('api_secret'),
  storeUrl: text('store_url'),
  status: text('status').notNull().default('active'),
  lastSyncAt: timestamp('last_sync_at'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_suppliers_user_id').on(table.userId),
  platformIdx: index('idx_suppliers_platform').on(table.platform),
}));

// Imported products table
export const importedProducts = pgTable('imported_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  supplierId: uuid('supplier_id').notNull().references(() => suppliers.id, { onDelete: 'cascade' }),
  externalId: text('external_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
  profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }),
  images: jsonb('images').default([]),
  variants: jsonb('variants').default([]),
  shippingTime: text('shipping_time'),
  stockQuantity: integer('stock_quantity').default(0),
  syncStatus: text('sync_status').notNull().default('pending'),
  lastSyncedAt: timestamp('last_synced_at'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_imported_products_user_id').on(table.userId),
  supplierIdIdx: index('idx_imported_products_supplier_id').on(table.supplierId),
  externalIdIdx: index('idx_imported_products_external_id').on(table.externalId),
}));

// Supplier orders table
export const supplierOrders = pgTable('supplier_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  supplierId: uuid('supplier_id').notNull().references(() => suppliers.id, { onDelete: 'cascade' }),
  customerOrderId: text('customer_order_id').notNull(),
  externalOrderId: text('external_order_id'),
  importedProductId: uuid('imported_product_id').references(() => importedProducts.id),
  status: text('status').notNull().default('pending'),
  trackingNumber: text('tracking_number'),
  shippingCarrier: text('shipping_carrier'),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  orderDetails: jsonb('order_details').default({}),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_supplier_orders_user_id').on(table.userId),
  statusIdx: index('idx_supplier_orders_status').on(table.status),
}));

// Sync logs table
export const syncLogs = pgTable('sync_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  supplierId: uuid('supplier_id').references(() => suppliers.id, { onDelete: 'cascade' }),
  syncType: text('sync_type').notNull(),
  status: text('status').notNull(),
  itemsProcessed: integer('items_processed').default(0),
  itemsFailed: integer('items_failed').default(0),
  errorDetails: jsonb('error_details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_sync_logs_user_id').on(table.userId),
}));

// Digital products table
export const digitalProducts = pgTable('digital_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  productId: uuid('product_id'),
  name: text('name').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  fileType: text('file_type'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  downloadLimit: integer('download_limit').default(5),
  accessDurationDays: integer('access_duration_days').default(30),
  licenseType: text('license_type').notNull().default('single'),
  requiresActivation: boolean('requires_activation').default(false),
  metadata: jsonb('metadata').default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_digital_products_user_id').on(table.userId),
}));

// License keys table
export const licenseKeys = pgTable('license_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  digitalProductId: uuid('digital_product_id').notNull().references(() => digitalProducts.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  customerOrderId: text('customer_order_id'),
  licenseKey: text('license_key').notNull().unique(),
  status: text('status').notNull().default('active'),
  activationCount: integer('activation_count').default(0),
  maxActivations: integer('max_activations').default(1),
  downloadCount: integer('download_count').default(0),
  maxDownloads: integer('max_downloads').default(5),
  expiresAt: timestamp('expires_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  ipAddresses: jsonb('ip_addresses').default([]),
  deviceFingerprints: jsonb('device_fingerprints').default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_license_keys_user_id').on(table.userId),
  customerEmailIdx: index('idx_license_keys_customer_email').on(table.customerEmail),
  licenseKeyIdx: index('idx_license_keys_license_key').on(table.licenseKey),
  statusIdx: index('idx_license_keys_status').on(table.status),
}));

// Download links table
export const downloadLinks = pgTable('download_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  licenseKeyId: uuid('license_key_id').notNull().references(() => licenseKeys.id, { onDelete: 'cascade' }),
  digitalProductId: uuid('digital_product_id').notNull().references(() => digitalProducts.id, { onDelete: 'cascade' }),
  secureToken: text('secure_token').notNull().unique(),
  downloadUrl: text('download_url').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  downloaded: boolean('downloaded').default(false),
  downloadedAt: timestamp('downloaded_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  secureTokenIdx: index('idx_download_links_secure_token').on(table.secureToken),
  expiresAtIdx: index('idx_download_links_expires_at').on(table.expiresAt),
}));

// Download logs table
export const downloadLogs = pgTable('download_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  licenseKeyId: uuid('license_key_id').notNull().references(() => licenseKeys.id, { onDelete: 'cascade' }),
  digitalProductId: uuid('digital_product_id').notNull().references(() => digitalProducts.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  downloadLinkId: uuid('download_link_id').references(() => downloadLinks.id),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  country: text('country'),
  city: text('city'),
  deviceInfo: jsonb('device_info'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  licenseKeyIdIdx: index('idx_download_logs_license_key_id').on(table.licenseKeyId),
}));

// Piracy alerts table
export const piracyAlerts = pgTable('piracy_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  digitalProductId: uuid('digital_product_id').references(() => digitalProducts.id, { onDelete: 'cascade' }),
  licenseKeyId: uuid('license_key_id').references(() => licenseKeys.id),
  alertType: text('alert_type').notNull(),
  severity: text('severity').notNull().default('medium'),
  details: jsonb('details').default({}),
  resolved: boolean('resolved').default(false),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_piracy_alerts_user_id').on(table.userId),
  resolvedIdx: index('idx_piracy_alerts_resolved').on(table.resolved),
}));

// Marketing campaigns table
export const marketingCampaigns = pgTable('marketing_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  platform: text('platform').notNull(),
  status: text('status').notNull().default('active'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  spent: decimal('spent', { precision: 10, scale: 2 }).default('0'),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_marketing_campaigns_user_id').on(table.userId),
  statusIdx: index('idx_marketing_campaigns_status').on(table.status),
}));

// Design projects table
export const designProjects = pgTable('design_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  clientName: text('client_name').notNull(),
  projectName: text('project_name').notNull(),
  description: text('description'),
  projectType: text('project_type'),
  status: text('status').notNull().default('planning'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  startDate: timestamp('start_date'),
  deadline: timestamp('deadline'),
  completionPercentage: integer('completion_percentage').default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_design_projects_user_id').on(table.userId),
  statusIdx: index('idx_design_projects_status').on(table.status),
}));

// Design milestones table
export const designMilestones = pgTable('design_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => designProjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  projectIdIdx: index('idx_design_milestones_project_id').on(table.projectId),
}));

// Content calendar table
export const contentCalendar = pgTable('content_calendar', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  contentType: text('content_type').notNull(),
  platform: text('platform'),
  description: text('description'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  status: text('status').notNull().default('draft'),
  wordCount: integer('word_count'),
  author: text('author'),
  tags: text('tags').array(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_content_calendar_user_id').on(table.userId),
  scheduledDateIdx: index('idx_content_calendar_scheduled_date').on(table.scheduledDate),
}));

// Order notifications table
export const orderNotifications = pgTable('order_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  orderId: text('order_id').notNull(),
  notificationType: text('notification_type').notNull(),
  customerEmail: text('customer_email').notNull(),
  trackingNumber: text('tracking_number'),
  carrier: text('carrier'),
  status: text('status').notNull().default('pending'),
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('idx_order_notifications_order_id').on(table.orderId),
}));

// WhatsApp contacts table
export const whatsappContacts = pgTable('whatsapp_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  phoneNumber: text('phone_number').notNull(),
  name: text('name'),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  notes: text('notes'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_whatsapp_contacts_user_id').on(table.userId),
  phoneIdx: index('idx_whatsapp_contacts_phone').on(table.phoneNumber),
}));

// WhatsApp contact groups table
export const whatsappContactGroups = pgTable('whatsapp_contact_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_whatsapp_groups_user_id').on(table.userId),
}));

// WhatsApp contact group members table
export const whatsappContactGroupMembers = pgTable('whatsapp_contact_group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').notNull().references(() => whatsappContacts.id, { onDelete: 'cascade' }),
  groupId: uuid('group_id').notNull().references(() => whatsappContactGroups.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueContactGroup: uniqueIndex('whatsapp_contact_group_members_contact_id_group_id_key')
    .on(table.contactId, table.groupId),
}));

// WhatsApp tags table
export const whatsappTags = pgTable('whatsapp_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  color: text('color').default('#10b981'),
  createdAt: timestamp('created_at').defaultNow(),
});

// WhatsApp contact tags table
export const whatsappContactTags = pgTable('whatsapp_contact_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').notNull().references(() => whatsappContacts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => whatsappTags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueContactTag: uniqueIndex('whatsapp_contact_tags_contact_id_tag_id_key')
    .on(table.contactId, table.tagId),
}));

// WhatsApp templates table
export const whatsappTemplates = pgTable('whatsapp_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  category: text('category').default('marketing'),
  variables: jsonb('variables').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// WhatsApp scheduled messages table
export const whatsappScheduledMessages = pgTable('whatsapp_scheduled_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  templateId: uuid('template_id').references(() => whatsappTemplates.id, { onDelete: 'set null' }),
  messageContent: text('message_content').notNull(),
  recipientType: text('recipient_type').notNull(),
  recipientIds: jsonb('recipient_ids').default([]),
  scheduledFor: timestamp('scheduled_for').notNull(),
  status: text('status').default('pending'),
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  scheduledStatusIdx: index('idx_whatsapp_scheduled_status').on(table.status, table.scheduledFor),
}));

// WhatsApp message logs table
export const whatsappMessageLogs = pgTable('whatsapp_message_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  contactId: uuid('contact_id').references(() => whatsappContacts.id, { onDelete: 'set null' }),
  scheduledMessageId: uuid('scheduled_message_id').references(() => whatsappScheduledMessages.id, { onDelete: 'set null' }),
  phoneNumber: text('phone_number').notNull(),
  messageContent: text('message_content').notNull(),
  status: text('status').default('sent'),
  whatsappMessageId: text('whatsapp_message_id'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata').default({}),
  sentAt: timestamp('sent_at').defaultNow(),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
}, (table) => ({
  userIdIdx: index('idx_whatsapp_message_logs_user_id').on(table.userId),
  statusIdx: index('idx_whatsapp_message_logs_status').on(table.status),
}));

// Business client messages table
export const businessClientMessages = pgTable('business_client_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull(),
  clientId: uuid('client_id').notNull(),
  senderType: text('sender_type').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  businessClientIdx: index('idx_messages_business_client').on(table.businessId, table.clientId),
  createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
}));

// Leads table
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  platform: text('platform'),
  source: text('source').notNull().default('manual'),
  tags: text('tags').array().default([]),
  status: text('status').notNull().default('new'),
  score: integer('score').default(0),
  segment: text('segment'),
  lastContact: timestamp('last_contact'),
  notes: text('notes'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userStatusIdx: index('idx_leads_user_status').on(table.userId, table.status),
  sourceIdx: index('idx_leads_source').on(table.source),
}));

// Lead campaigns table
export const leadCampaigns = pgTable('lead_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('active'),
  campaignType: text('campaign_type').notNull().default('outreach'),
  channel: text('channel').notNull().default('email'),
  scriptTemplate: text('script_template'),
  rules: jsonb('rules').default({}),
  stats: jsonb('stats').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_lead_campaigns_user').on(table.userId),
}));

// AI conversations table
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id').references(() => leadCampaigns.id, { onDelete: 'set null' }),
  channel: text('channel').notNull().default('email'),
  status: text('status').notNull().default('active'),
  messages: jsonb('messages').default([]),
  sentiment: text('sentiment').default('neutral'),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  leadIdx: index('idx_ai_conversations_lead').on(table.leadId),
}));

// Automation logs table
export const automationLogs = pgTable('automation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  campaignId: uuid('campaign_id').references(() => leadCampaigns.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  channel: text('channel'),
  status: text('status').notNull().default('success'),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_automation_logs_user').on(table.userId, table.createdAt),
}));

// Outreach templates table
export const outreachTemplates = pgTable('outreach_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull().default('general'),
  channel: text('channel').notNull().default('email'),
  subject: text('subject'),
  content: text('content').notNull(),
  variables: jsonb('variables').default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Customer referrals table
export const customerReferrals = pgTable('customer_referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrerId: uuid('referrer_id').notNull(),
  referredEmail: text('referred_email').notNull(),
  referredCustomerId: uuid('referred_customer_id'),
  businessId: uuid('business_id').notNull(),
  referralCode: text('referral_code').notNull().unique(),
  status: text('status').notNull().default('pending'),
  commissionAmount: decimal('commission_amount').default('0'),
  commissionPaid: boolean('commission_paid').default(false),
  deviceFingerprint: text('device_fingerprint'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  convertedAt: timestamp('converted_at'),
  paidAt: timestamp('paid_at'),
}, (table) => ({
  referrerIdx: index('idx_referrals_referrer').on(table.referrerId),
  codeIdx: index('idx_referrals_code').on(table.referralCode),
}));

// Referral payouts table
export const referralPayouts = pgTable('referral_payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrerId: uuid('referrer_id').notNull(),
  businessId: uuid('business_id').notNull(),
  amount: decimal('amount').notNull(),
  status: text('status').notNull().default('pending'),
  payoutMethod: text('payout_method'),
  payoutAccount: text('payout_account'),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
});

// Customer disputes table
export const customerDisputes = pgTable('customer_disputes', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull(),
  businessId: uuid('business_id').notNull(),
  orderId: text('order_id'),
  appointmentId: text('appointment_id'),
  disputeType: text('dispute_type').notNull(),
  status: text('status').notNull().default('open'),
  amount: decimal('amount').notNull(),
  refundAmount: decimal('refund_amount').default('0'),
  description: text('description').notNull(),
  evidenceUrls: text('evidence_urls').array(),
  businessResponse: text('business_response'),
  businessEvidenceUrls: text('business_evidence_urls').array(),
  adminNotes: text('admin_notes'),
  autoRefundDeadline: timestamp('auto_refund_deadline'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at'),
}, (table) => ({
  customerIdx: index('idx_disputes_customer').on(table.customerId),
  businessIdx: index('idx_disputes_business').on(table.businessId),
  statusIdx: index('idx_disputes_status').on(table.status),
}));

// Dispute events table
export const disputeEvents = pgTable('dispute_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  disputeId: uuid('dispute_id').notNull().references(() => customerDisputes.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  actorType: text('actor_type').notNull(),
  actorId: uuid('actor_id'),
  description: text('description').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  disputeIdx: index('idx_dispute_events_dispute').on(table.disputeId),
}));

// Customer payout accounts table
export const customerPayoutAccounts = pgTable('customer_payout_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().unique(),
  accountType: text('account_type').notNull(),
  accountName: text('account_name').notNull(),
  accountNumber: text('account_number').notNull(),
  bankName: text('bank_name'),
  routingNumber: text('routing_number'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Broadcasts table
export const broadcasts = pgTable('broadcasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  subject: text('subject'),
  content: text('content').notNull(),
  channel: text('channel').notNull().default('email'),
  segmentType: text('segment_type').notNull().default('all'),
  segmentFilters: jsonb('segment_filters').default({}),
  templateId: uuid('template_id'),
  status: text('status').notNull().default('draft'),
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  totalRecipients: integer('total_recipients').default(0),
  deliveredCount: integer('delivered_count').default(0),
  openedCount: integer('opened_count').default(0),
  clickedCount: integer('clicked_count').default(0),
  failedCount: integer('failed_count').default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userStatusIdx: index('idx_broadcasts_user_status').on(table.userId, table.status),
}));

// Broadcast recipients table
export const broadcastRecipients = pgTable('broadcast_recipients', {
  id: uuid('id').primaryKey().defaultRandom(),
  broadcastId: uuid('broadcast_id').notNull().references(() => broadcasts.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  status: text('status').notNull().default('pending'),
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  broadcastIdx: index('idx_broadcast_recipients_broadcast').on(table.broadcastId),
}));

// Message threads table
export const messageThreads = pgTable('message_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  channel: text('channel').notNull().default('email'),
  subject: text('subject'),
  status: text('status').notNull().default('open'),
  lastMessageAt: timestamp('last_message_at'),
  unreadCount: integer('unread_count').default(0),
  isAiHandled: boolean('is_ai_handled').default(false),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_message_threads_user').on(table.userId, table.status),
}));

// Thread messages table
export const threadMessages = pgTable('thread_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => messageThreads.id, { onDelete: 'cascade' }),
  senderType: text('sender_type').notNull().default('business'),
  content: text('content').notNull(),
  attachments: jsonb('attachments').default([]),
  readAt: timestamp('read_at'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  threadIdx: index('idx_thread_messages_thread').on(table.threadId),
}));

// Customer preferences table
export const customerPreferences = pgTable('customer_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  customerEmail: text('customer_email').notNull(),
  emailOptedIn: boolean('email_opted_in').default(true),
  whatsappOptedIn: boolean('whatsapp_opted_in').default(true),
  smsOptedIn: boolean('sms_opted_in').default(true),
  inAppOptedIn: boolean('in_app_opted_in').default(true),
  suppressed: boolean('suppressed').default(false),
  suppressionReason: text('suppression_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserEmail: uniqueIndex('customer_preferences_user_id_customer_email_key')
    .on(table.userId, table.customerEmail),
}));

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  orderId: text('order_id'),
  appointmentId: text('appointment_id'),
  rating: integer('rating').notNull(),
  title: text('title'),
  content: text('content'),
  status: text('status').notNull().default('pending'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  helpfulCount: integer('helpful_count').default(0),
  deviceFingerprint: text('device_fingerprint'),
  ipAddress: text('ip_address'),
  response: text('response'),
  respondedAt: timestamp('responded_at'),
  moderationNotes: text('moderation_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userStatusIdx: index('idx_reviews_user_status').on(table.userId, table.status),
}));

// Review photos table
export const reviewPhotos = pgTable('review_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewId: uuid('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  photoUrl: text('photo_url').notNull(),
  caption: text('caption'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Email domains table
export const emailDomains = pgTable('email_domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  domain: text('domain').notNull(),
  status: text('status').notNull().default('pending'),
  dkimRecord: text('dkim_record'),
  spfRecord: text('spf_record'),
  dkimVerified: boolean('dkim_verified').default(false),
  spfVerified: boolean('spf_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  lastCheckAt: timestamp('last_check_at'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserDomain: uniqueIndex('email_domains_user_id_domain_key').on(table.userId, table.domain),
}));

// Email events table
export const emailEvents = pgTable('email_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  broadcastId: uuid('broadcast_id').references(() => broadcasts.id),
  recipientId: uuid('recipient_id').references(() => broadcastRecipients.id),
  eventType: text('event_type').notNull(),
  emailAddress: text('email_address').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_email_events_user').on(table.userId, table.createdAt),
}));

// Affiliate links table
export const affiliateLinks = pgTable('affiliate_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  affiliateId: uuid('affiliate_id').notNull(),
  code: text('code').notNull().unique(),
  targetUrl: text('target_url'),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  revenueGenerated: decimal('revenue_generated').default('0'),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_affiliate_links_user').on(table.userId),
}));

// Affiliate commissions table
export const affiliateCommissions = pgTable('affiliate_commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateLinkId: uuid('affiliate_link_id').notNull().references(() => affiliateLinks.id),
  affiliateId: uuid('affiliate_id').notNull(),
  orderId: text('order_id'),
  orderAmount: decimal('order_amount').notNull(),
  commissionRate: decimal('commission_rate').notNull().default('0.10'),
  commissionAmount: decimal('commission_amount').notNull(),
  status: text('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Affiliate payouts table
export const affiliatePayouts = pgTable('affiliate_payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').notNull(),
  amount: decimal('amount').notNull(),
  status: text('status').notNull().default('pending'),
  payoutMethod: text('payout_method'),
  payoutDetails: jsonb('payout_details').default({}),
  processedAt: timestamp('processed_at'),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Payment holds table
export const paymentHolds = pgTable('payment_holds', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  orderId: text('order_id'),
  appointmentId: text('appointment_id'),
  customerEmail: text('customer_email').notNull(),
  amount: decimal('amount').notNull(),
  status: text('status').notNull().default('held'),
  holdReason: text('hold_reason').default('delivery_pending'),
  releaseAfter: timestamp('release_after'),
  releasedAt: timestamp('released_at'),
  refundedAt: timestamp('refunded_at'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_payment_holds_user').on(table.userId, table.status),
}));
