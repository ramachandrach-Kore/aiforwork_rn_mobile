import {isAndroid} from './CommonFunctions';

export const google = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/user.organization.read',
  // 'https://www.googleapis.com/auth/contacts.readonly',
  // 'https://www.googleapis.com/auth/admin.directory.user.readonly',
  // 'https://www.googleapis.com/auth/directory.readonly',
  // 'https://www.googleapis.com/auth/contacts.other.readonly',
  // 'https://www.googleapis.com/auth/calendar',
  // 'https://www.googleapis.com/auth/gmail.readonly',
  // 'https://www.googleapis.com/auth/gmail.send',
  // 'https://www.googleapis.com/auth/drive.readonly',
];

export const KORE_PREFIX = 'workassist://';
export const REDIRECT_URL =
  KORE_PREFIX + (isAndroid ? 'androidsso' : 'iphoneapp');
//Azure AD
export const azure = 'User.Read'; // MailboxSettings.Read Mail.Send People.Read Directory.Read.All Calendars.Read Calendars.ReadWrite Place.Read.All Mail.Read Files.ReadWrite Sites.Read.All Files.Read.All ExternalItem.Read.All offline_access';
export const SSO_365 = 'AzureAD';
export const GmailScopes = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/contacts.other.readonly',
];
