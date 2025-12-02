export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  schedulingUrl: string;
  timezone: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  schedulingUrl: string;
  duration: number;
  kind: 'solo' | 'group';
  poolingType?: 'round_robin' | 'collective';
  type: 'StandardEventType' | 'AdhocEventType';
  color: string;
  descriptionPlain?: string;
  descriptionHtml?: string;
  internalNote?: string;
}

export interface CalendlyScheduledEvent {
  uri: string;
  name: string;
  status: 'active' | 'canceled';
  startTime: string;
  endTime: string;
  eventType: string;
  location?: CalendlyLocation;
  inviteesCounter: {
    total: number;
    active: number;
    limit: number;
  };
  createdAt: string;
  updatedAt: string;
  eventMemberships: Array<{
    user: string;
  }>;
  eventGuests?: Array<{
    email: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CalendlyLocation {
  type: 'physical' | 'outbound_call' | 'inbound_call' | 'google_conference' | 'zoom' | 'microsoft_teams' | 'webex' | 'gotomeeting' | 'custom';
  location?: string;
  additionalInfo?: string;
  status?: string;
  joinUrl?: string;
  data?: Record<string, any>;
}

export interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  status: 'active' | 'canceled';
  timezone: string;
  event: string;
  createdAt: string;
  updatedAt: string;
  tracking?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    salesforceUuid?: string;
  };
  textReminderNumber?: string;
  rescheduled: boolean;
  oldInvitee?: string;
  newInvitee?: string;
  cancelUrl: string;
  rescheduleUrl: string;
  routingFormSubmission?: string;
  payment?: {
    externalId: string;
    provider: string;
    amount: number;
    currency: string;
    terms: string;
    successful: boolean;
  };
  noShow?: {
    uri: string;
    createdAt: string;
  };
  reconfirmation?: {
    createdAt: string;
    confirmedAt?: string;
  };
  scheduling_method?: 'instant_book' | 'poll';
  questionsAndAnswers?: Array<{
    question: string;
    answer: string;
    position: number;
  }>;
}

export interface CalendlyWebhook {
  uri: string;
  callbackUrl: string;
  createdAt: string;
  updatedAt: string;
  retryStartedAt?: string;
  state: 'active' | 'disabled';
  events: string[];
  scope: 'user' | 'organization';
  organization: string;
  user?: string;
  creator: string;
}

export interface CalendlyWebhookPayload {
  event: 'invitee.created' | 'invitee.canceled' | 'routing_form_submission.created';
  createdAt: string;
  createdBy: string;
  payload: {
    uri: string;
    event?: CalendlyScheduledEvent;
    invitee?: CalendlyInvitee;
    routingFormSubmission?: Record<string, any>;
  };
}

export interface CalendlySettings {
  id: string;
  tenantId: string;
  accessToken?: string;
  refreshToken?: string;
  organizationUri?: string;
  userUri?: string;
  webhookUri?: string;
  isConnected: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
