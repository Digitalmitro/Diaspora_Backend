export const AUTH = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_SALT_ROUNDS: 10,
  JWT_EXPIRY_DAYS: '7d',
  JWT_EXPIRY_REFRESH: '30d',
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

export const RATE_LIMITS = {
  AUTH_WINDOW_MS: 15 * 60 * 1000,
  AUTH_MAX_REQUESTS: 5,
  GENERAL_WINDOW_MS: 15 * 60 * 1000,
  GENERAL_MAX_REQUESTS: 100,
  STRICT_WINDOW_MS: 60 * 60 * 1000,
  STRICT_MAX_REQUESTS: 3,
};

export const VALIDATION = {
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 100,
  SLUG_MIN_LENGTH: 2,
  SLUG_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 500,
  COVER_LETTER_MAX_LENGTH: 2000,
  EXPERIENCE_MIN: 0,
  SKILLS_MIN_ARRAY: 1,
  SALARY_MIN: 0,
  OPENINGS_MIN: 1,
  RATING_MIN: 1,
  RATING_MAX: 5,
  BIO_MAX_LENGTH: 500,
  COMPANY_DESCRIPTION_MAX_LENGTH: 1000,
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  INTERVIEWED: 'interviewed',
};

export const VALID_APPLICATION_STATUSES = Object.values(APPLICATION_STATUS);

export const JOB_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};

export const VALID_JOB_STATUSES = Object.values(JOB_STATUS);

export const JOB_TYPE = {
  FULLTIME: 'fulltime',
  PARTTIME: 'parttime',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
};

export const VALID_JOB_TYPES = Object.values(JOB_TYPE);

export const USER_ROLE = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  JOB_SEEKER: 'jobseeker',
};

export const VALID_USER_ROLES = Object.values(USER_ROLE);

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const VALID_VERIFICATION_STATUSES = Object.values(VERIFICATION_STATUS);

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const VALID_CONTENT_STATUSES = Object.values(CONTENT_STATUS);

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PENDING: 'pending',
};

export const VALID_SUBSCRIPTION_STATUSES = Object.values(SUBSCRIPTION_STATUS);

export const BILLING_CYCLE = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const VALID_BILLING_CYCLES = Object.values(BILLING_CYCLE);

export const PAYMENT_METHOD = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
};

export const VALID_PAYMENT_METHODS = Object.values(PAYMENT_METHOD);

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const VALID_PAYMENT_STATUSES = Object.values(PAYMENT_STATUS);

export const SUBSCRIPTION_PLAN = {
  BASIC: 'basic',
  PRO: 'pro',
  PREMIUM: 'premium',
};

export const VALID_SUBSCRIPTION_PLANS = Object.values(SUBSCRIPTION_PLAN);

export const STATIC_PAGE_TYPE = {
  PRIVACY: 'privacy',
  TERMS: 'terms',
  ABOUT: 'about',
  CONTACT: 'contact',
};

export const VALID_STATIC_PAGE_TYPES = Object.values(STATIC_PAGE_TYPE);

export const JOB_ALERT_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
};

export const VALID_JOB_ALERT_FREQUENCIES = Object.values(JOB_ALERT_FREQUENCY);

export const EDUCATION_DEGREE = {
  HIGHSCHOOL: 'highschool',
  DIPLOMA: 'diploma',
  BACHELOR: 'bachelor',
  MASTER: 'master',
  PHD: 'phd',
};

export const VALID_EDUCATION_DEGREES = Object.values(EDUCATION_DEGREE);

export const INSTITUTION_TYPE = {
  ANY: 'any',
  TIER1: 'tier1',
  TIER2: 'tier2',
  TIER3: 'tier3',
  IIT: 'iit',
  NIT: 'nit',
  IIIT: 'iiit',
  IVY_LEAGUE: 'ivy_league',
  TOP_UNIVERSITIES: 'top_universities',
};

export const VALID_INSTITUTION_TYPES = Object.values(INSTITUTION_TYPE);

export const SKILL_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

export const VALID_SKILL_LEVELS = Object.values(SKILL_LEVEL);

export const CURRENCY = {
  DEFAULT: 'USD',
};

export const SKILLS_MATCH_SCORE = {
  MIN: 0,
  MAX: 100,
};

export const UPLOAD = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DEFAULTS = {
  USER_ROLE: USER_ROLE.JOB_SEEKER,
  JOB_STATUS: JOB_STATUS.DRAFT,
  APPLICATION_STATUS: APPLICATION_STATUS.APPLIED,
  CONTENT_STATUS: CONTENT_STATUS.DRAFT,
  BILLING_CYCLE: BILLING_CYCLE.MONTHLY,
  SUBSCRIPTION_STATUS: SUBSCRIPTION_STATUS.PENDING,
  PAYMENT_STATUS: PAYMENT_STATUS.PENDING,
  VERIFICATION_STATUS: VERIFICATION_STATUS.PENDING,
  CURRENCY: CURRENCY.DEFAULT,
  SKILL_LEVEL: SKILL_LEVEL.INTERMEDIATE,
  EDUCATION_DEGREE: EDUCATION_DEGREE.BACHELOR,
  INSTITUTION_TYPE: INSTITUTION_TYPE.ANY,
  JOB_ALERT_FREQUENCY: JOB_ALERT_FREQUENCY.WEEKLY,
};
