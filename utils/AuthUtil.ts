// utils/AuthUtil.ts

/* axios used to handling network (GET, POST, PUT) requests and handle responses easily
similar to fetch, but with additional convenience features like:
Built-in JSON transformation, Request/response interceptors, Timeout handling
Easy setting of headers and authentication */
import axios from 'axios';

// Available authentication types
type AuthType = 'bearer' | 'basic' | 'apiKey' | 'oauth2' | 'none';

// Configuration interface
interface AuthConfig {
  type: AuthType;

  // Bearer
  bearerToken?: string;

  // Basic Auth
  username?: string;
  password?: string;

  // API Key
  apiKeyName?: string;
  apiKeyValue?: string;

  // OAuth 2.0 (Client Credentials)
  oauth?: {
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope?: string;
    audience?: string;
  };
}

// Main reusable function to generate headers
/* How to call in test -->
  const headers = await getAuthHeaders({
    type: 'oauth2',
    oauth: {
      tokenUrl: 'https://auth.example.com/token',
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      scope: 'read:data',
    },
  }); */
export async function getAuthHeaders(config: AuthConfig): Promise<Record<string, string>> {
  switch (config.type) {
    case 'bearer':
      if (!config.bearerToken) throw new Error('Bearer token is required.');
      return {
        Authorization: `Bearer ${config.bearerToken}`,
      };

    case 'basic':
      if (!config.username || !config.password) throw new Error('Username and password are required for Basic Auth.');
      const encoded = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      return {
        Authorization: `Basic ${encoded}`,
      };

    case 'apiKey':
      if (!config.apiKeyName || !config.apiKeyValue) throw new Error('API key name and value are required.');
      return {
        [config.apiKeyName]: config.apiKeyValue,
      };

    case 'oauth2':
      if (!config.oauth) throw new Error('OAuth config is required.');
      const token = await fetchOAuthToken(config.oauth);
      return {
        Authorization: `Bearer ${token}`,
      };

    case 'none':
    default:
      return {};
  }
}

// Internal helper to fetch OAuth token
// This function needs to be updated as per OAuth2 configuration in your project.
async function fetchOAuthToken(oauth: {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
  audience?: string;
}): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  if (oauth.audience) {
    params.append('audience', oauth.audience);
  }

  if (oauth.scope) {
    params.append('scope', oauth.scope);
  }

  const response = await axios.post(
    oauth.tokenUrl,
    params,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: oauth.clientId,
        password: oauth.clientSecret,
      },
    }
  );

  return response.data.access_token;
}
