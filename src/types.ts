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

export interface ProfileState {
  active: string | null;
}

export interface ProfileInfo {
  name: string;
  subscriptionType: string | null;
  isActive: boolean;
}
