import { request as playwrightRequest, APIRequestContext } from "@playwright/test";

const baseURL = process.env.BOOKING_API;
const authURL = process.env.AUTH_API;

/*// FUNCTION --> Basic token request with headers, payload and timeout options
export async function createPOSToken(request: APIRequestContext, data: any) {
    
  const url = `${authURL}/booking`;
  
  // Log: request URL and data
  console.log('Sending POST request to:', url);
  console.log('Request payload:', JSON.stringify(data, null, 2));

  return await request.post(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data,
    timeout: 60000
  });
}*/

// FUNCTION --> Token request with local proxy config, headers, payload and timeout options
function getBasicAuthHeader(username: string, password: string): string {
  const encoded = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${encoded}`;
}

type ProxyConfig = {
  server: string;
  username?: string;
  password?: string;
};

/* //To call below function with proxy -->
const response = await createPOSToken(request, data, 'user', 'pass', {
  server: 'http://your-proxy:8080',
  username: 'proxyuser',
  password: 'proxypass'
}); */
export async function createPOSToken(
  request: APIRequestContext,
  data: any,
  username: string,
  password: string,
  proxy?: ProxyConfig // Added optional proxy param
) {
  const url = `${authURL}/oauth2/v1/token`;

  console.log('Sending POST request to:', url);
  console.log('Request payload:', JSON.stringify(data, null, 2));

  const basicAuth = getBasicAuthHeader(username, password);

  // If proxy is provided, create a new context with proxy
  if (proxy) {
    console.log('Using proxy:', proxy.server);

    const proxyContext = await playwrightRequest.newContext({
      proxy: {
        server: proxy.server,
        username: proxy.username,
        password: proxy.password
      }
    });

    const response = await proxyContext.post(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth
      },
      data,
      timeout: 60000
    });
    await proxyContext.dispose();
    return response;
    }
  }