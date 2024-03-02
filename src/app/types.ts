export type FormMode = "NEW" | "EDIT";

export type User = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  autoresponder?: {
    isActive: boolean;
    createdOn: Date | string;
  };
};

export type MailServerSecurity = "tls" | "ssl" | "unsecure";

export type MailServerVerificationType = "imap" | "smtp";

export type MailServerVerificationTypeObject = {
  [key in MailServerVerificationType]: key;
};

export type ServerConfig = {
  hostname: string;
  port: string;
  email: string;
  password: string;
  security: MailServerSecurity;
  verificationType?: MailServerVerificationType;
};

export type SMTPServerConfig = ServerConfig & { recipientEmail: string };

export type MailServer = {
  _id: string;
  name: string;
  addedOn: Date;
  lastModified: Date;
  userId: string;
  imapDetails: ServerConfig;
  smtpDetails: SMTPServerConfig;
};

export type NewMailServer = Omit<
  MailServer,
  "_id" | "addedOn" | "lastModified" | "userId"
>;

export type EmailListType = "replyEmails" | "clientEmails";

export type EmailList = {
  _id: string;
  name: string;
  totalEmails: number;
  createdAt: Date;
  lastModified: Date;
  emailListType: EmailListType;
  userId: string;
  url: string;
};

export type WarmupState =
  | "notStarted"
  | "running"
  | "completed"
  | "failed"
  | "paused";

export type UpdateWarmupState = "pause" | "resume";

export type Warmup = {
  _id: string;
  name: string;
  createdAt: Date;
  startedAt: Date;
  state: WarmupState;
  mailserverName: string;
  clientEmailListName: string;
  replyEmailListName: string;
  userId: string;
  maxDays: number;
  increaseRate: number;
  startVolume: number;
  dailySendLimit: number;
  autoResponderEnabled: boolean;
  targetOpenRate: number;
  targetReplyRate: number;
  totalWarmupDays: number;
  totalAddressesMailed: number;
  currentWarmupDay: number;
};

export type NewWarmup = {
  name: string;
  mailserverId: string;
  clientEmailListId: string;
  replyEmailListId: string;
  maxDays: number;
  increaseRate: number;
  startVolume: number;
  dailySendLimit: number;
  autoResponderEnabled: boolean;
  targetOpenRate: number;
  targetReplyRate: number;
};

/*
 *  API Error Types
 * */
// type BadRequestResponse = {
//   message: string,
//   description: string,
// }
//
// type UnauthorizedRequestResponse =  BadRequestResponse
//
// type ValidationErrorResponse = BadRequestResponse & {
//   detail: {
//     loc: number[],
//     msg: string
//   }[]
// }

export type AddMailServerResponse = {
  message: string;
  description: string;
  mailServer: MailServer;
};

export type SignInUser = {
  accessToken: string;
  tokenType: string;
  userId: string;
  username: string;
};

export type Announcements = {
  _id: string;
  message: string;
  details: string;
  addedAt: number;
  priority: string;
};
