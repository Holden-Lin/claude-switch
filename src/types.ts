export interface OAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: string[];
  subscriptionType?: string;
  rateLimitTier?: string;
}

export interface CredentialsFile {
  claudeAiOauth: OAuthCredentials;
  mcpOAuth?: unknown;
  [key: string]: unknown;
}

export interface OAuthAccount {
  accountUuid?: string;
  emailAddress?: string;
  organizationUuid?: string;
  displayName?: string;
  organizationRole?: string;
  organizationName?: string;
  workspaceRole?: string | null;
  billingType?: string;
  hasExtraUsageEnabled?: boolean;
  accountCreatedAt?: string;
  subscriptionCreatedAt?: string;
  [key: string]: unknown;
}

export type ProfileType = "oauth" | "api-key";

export interface ProfileData {
  type: ProfileType;
  apiKey?: string;
}

export interface ProfileState {
  active: string | null;
}

export interface ProfileInfo {
  name: string;
  type: ProfileType;
  label: string | null; // subscription type for oauth, masked key for api-key
  isActive: boolean;
}
