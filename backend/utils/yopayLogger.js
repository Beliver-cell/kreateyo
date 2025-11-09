const fs = require('fs');
const path = require('path');

class YopayLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      service: 'yopay'
    };

    const logFile = path.join(this.logDir, `yopay-${new Date().toISOString().split('T')[0]}.log`);
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[YOPAY ${level.toUpperCase()}]`, message, metadata);
    }
  }

  info(message, metadata) {
    this.log('info', message, metadata);
  }

  error(message, metadata) {
    this.log('error', message, metadata);
  }

  warn(message, metadata) {
    this.log('warn', message, metadata);
  }

  payment(action, data) {
    this.log('payment', action, {
      ...data,
      // Mask sensitive data
      customerEmail: data.customerEmail ? this.maskEmail(data.customerEmail) : undefined,
      customerPhone: data.customerPhone ? this.maskPhone(data.customerPhone) : undefined
    });
  }

  maskEmail(email) {
    const [local, domain] = email.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  }

  maskPhone(phone) {
    if (!phone) return undefined;
    return `***${phone.slice(-4)}`;
  }
}

module.exports = new YopayLogger();
