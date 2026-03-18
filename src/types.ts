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
