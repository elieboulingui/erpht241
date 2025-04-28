
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  password: 'password',
  role: 'role',
  accessType: 'accessType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.OrganisationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  domain: 'domain',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  token: 'token',
  expires: 'expires',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt'
};

exports.Prisma.AuthenticatorScalarFieldEnum = {
  id: 'id',
  credentialID: 'credentialID',
  userId: 'userId',
  providerAccountId: 'providerAccountId',
  credentialPublicKey: 'credentialPublicKey',
  counter: 'counter',
  credentialDeviceType: 'credentialDeviceType',
  credentialBackedUp: 'credentialBackedUp',
  transports: 'transports'
};

exports.Prisma.InvitationScalarFieldEnum = {
  id: 'id',
  email: 'email',
  organisationId: 'organisationId',
  role: 'role',
  accessType: 'accessType',
  invitedById: 'invitedById',
  invitedAt: 'invitedAt',
  acceptedAt: 'acceptedAt',
  token: 'token',
  tokenExpiresAt: 'tokenExpiresAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  name: 'name',
  logo: 'logo',
  adresse: 'adresse',
  status_contact: 'status_contact',
  email: 'email',
  phone: 'phone',
  niveau: 'niveau',
  tags: 'tags',
  sector: 'sector',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  createdAt: 'createdAt',
  contactId: 'contactId',
  updatedAt: 'updatedAt',
  createdByUserId: 'createdByUserId'
};

exports.Prisma.FeedbackContactScalarFieldEnum = {
  id: 'id',
  message: 'message',
  contactId: 'contactId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdByUserId: 'createdByUserId'
};

exports.Prisma.FavoriteScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  organisationId: 'organisationId',
  createdByUserId: 'createdByUserId'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  images: 'images',
  actions: 'actions',
  organisationId: 'organisationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  brandId: 'brandId',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.StockScalarFieldEnum = {
  id: 'id',
  quantity: 'quantity',
  productId: 'productId',
  organisationId: 'organisationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  organisationId: 'organisationId',
  logo: 'logo',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  organisationId: 'organisationId',
  logo: 'logo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.NoteScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  color: 'color',
  isPinned: 'isPinned',
  lastModified: 'lastModified',
  userId: 'userId',
  contactId: 'contactId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.DevisScalarFieldEnum = {
  id: 'id',
  devisNumber: 'devisNumber',
  taxType: 'taxType',
  status: 'status',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  totalWithTax: 'totalWithTax',
  notes: 'notes',
  pdfUrl: 'pdfUrl',
  creationDate: 'creationDate',
  lastModified: 'lastModified',
  archivedDate: 'archivedDate',
  dueDate: 'dueDate',
  organisationId: 'organisationId',
  contactId: 'contactId',
  createdById: 'createdById',
  isArchived: 'isArchived',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.DevisItemScalarFieldEnum = {
  id: 'id',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  taxRate: 'taxRate',
  taxAmount: 'taxAmount',
  totalPrice: 'totalPrice',
  totalWithTax: 'totalWithTax',
  creationDate: 'creationDate',
  lastModified: 'lastModified',
  devisId: 'devisId',
  productId: 'productId',
  createdByUserId: 'createdByUserId'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  status: 'status',
  priority: 'priority',
  assigneeId: 'assigneeId',
  dueDate: 'dueDate',
  organisationId: 'organisationId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isArchived: 'isArchived',
  archivedAt: 'archivedAt',
  archivedBy: 'archivedBy',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  oldData: 'oldData',
  newData: 'newData',
  userId: 'userId',
  organisationId: 'organisationId',
  createdByUserId: 'createdByUserId',
  updatedByUserId: 'updatedByUserId',
  relatedUserId: 'relatedUserId',
  accountId: 'accountId',
  sessionId: 'sessionId',
  authenticatorId: 'authenticatorId',
  invitationId: 'invitationId',
  passwordResetTokenId: 'passwordResetTokenId',
  contactId: 'contactId',
  commentId: 'commentId',
  feedbackContactId: 'feedbackContactId',
  favoriteId: 'favoriteId',
  productId: 'productId',
  stockId: 'stockId',
  categoryId: 'categoryId',
  brandId: 'brandId',
  noteId: 'noteId',
  devisId: 'devisId',
  devisItemId: 'devisItemId',
  taskId: 'taskId',
  createdAt: 'createdAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  actionDetails: 'actionDetails',
  entityName: 'entityName'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  ADMIN: 'ADMIN',
  MEMBRE: 'MEMBRE'
};

exports.AccessType = exports.$Enums.AccessType = {
  READ: 'READ',
  WRITE: 'WRITE',
  ADMIN: 'ADMIN'
};

exports.Domain = exports.$Enums.Domain = {
  AGRICULTURE: 'AGRICULTURE',
  ENERGIE: 'ENERGIE',
  LOGISTIQUE: 'LOGISTIQUE',
  NUMERIQUE: 'NUMERIQUE',
  SECURITE: 'SECURITE',
  TRANSPORT: 'TRANSPORT',
  INFORMATIQUE: 'INFORMATIQUE',
  SANTE: 'SANTE',
  EDUCATION: 'EDUCATION',
  FINANCE: 'FINANCE',
  COMMERCE: 'COMMERCE',
  CONSTRUCTION: 'CONSTRUCTION',
  ENVIRONNEMENT: 'ENVIRONNEMENT',
  TOURISME: 'TOURISME',
  INDUSTRIE: 'INDUSTRIE',
  TELECOMMUNICATIONS: 'TELECOMMUNICATIONS',
  IMMOBILIER: 'IMMOBILIER',
  ADMINISTRATION: 'ADMINISTRATION',
  ART_CULTURE: 'ART_CULTURE',
  ALIMENTATION: 'ALIMENTATION'
};

exports.Status_Contact = exports.$Enums.Status_Contact = {
  PERSONNE: 'PERSONNE',
  COMPAGNIE: 'COMPAGNIE',
  GROSSISTE: 'GROSSISTE'
};

exports.Niveau = exports.$Enums.Niveau = {
  PROSPECT: 'PROSPECT',
  CLIENT: 'CLIENT',
  PROSPECT_POTENTIAL: 'PROSPECT_POTENTIAL'
};

exports.TaxType = exports.$Enums.TaxType = {
  TVA: 'TVA',
  HORS_TAXE: 'HORS_TAXE'
};

exports.DevisStatus = exports.$Enums.DevisStatus = {
  ATTENTE: 'ATTENTE',
  VALIDE: 'VALIDE',
  FACTURE: 'FACTURE',
  ARCHIVE: 'ARCHIVE'
};

exports.TaskType = exports.$Enums.TaskType = {
  FEATURE: 'FEATURE',
  BUG: 'BUG',
  DOCUMENTATION: 'DOCUMENTATION'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING: 'WAITING',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

exports.Prisma.ModelName = {
  User: 'User',
  Organisation: 'Organisation',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  Authenticator: 'Authenticator',
  Invitation: 'Invitation',
  PasswordResetToken: 'PasswordResetToken',
  Contact: 'Contact',
  Comment: 'Comment',
  FeedbackContact: 'FeedbackContact',
  Favorite: 'Favorite',
  Product: 'Product',
  Stock: 'Stock',
  Category: 'Category',
  Brand: 'Brand',
  Note: 'Note',
  Devis: 'Devis',
  DevisItem: 'DevisItem',
  Task: 'Task',
  ActivityLog: 'ActivityLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
