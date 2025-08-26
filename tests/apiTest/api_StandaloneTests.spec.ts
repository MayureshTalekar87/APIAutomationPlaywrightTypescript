import { test, expect, request } from '@playwright/test';
import * as fs from 'fs';
import 'dotenv/config'; // This loads .env automatically used in test 4.1
import { getAuthHeaders } from '../../utils/AuthUtil'; // For Authorization reusable function

// Test case: sending File with form data -->
test('httpbin: multipart form-data with file and field', async () => {
  const apiContext = await request.newContext();

  const buffer = fs.readFileSync('testdata/petslover.xml');

  const response = await apiContext.post('https://httpbin.org/post', {
    multipart: {  //Sends a multipart form data with fields
      description: 'Pets XML data', // simple text field
      file: {
        name: 'petslover.xml',
        mimeType: 'application/xml',
        buffer: buffer // binary buffer (actual file attached here)
      }
    }
  });

  console.log('Status:', response.status());
  console.log('Body:', await response.text());
  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  console.log('Description:', body.form.description);
  console.log('Uploaded file content:', body.files.file); // base64 or string
});

// Test Case: Raw xml payload -->
test('Send raw XML payload', async () => {
  const apiContext = await request.newContext();

  // Read XML file as string
  const xmlData :string = fs.readFileSync('testdata/petslover.xml','utf-8');

  const response = await apiContext.post('https://postman-echo.com/post', {
    headers: {
      'Content-Type': 'application/xml'
    },
    data: xmlData
  });

  console.log('Status:', response.status());
  console.log('Body:', await response.text());
  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  console.log('Echoed XML data:', responseBody.data); // httpbin echoes raw request body here
  console.log(JSON.stringify(responseBody, null, 2));

});

// Different Authentication request Test Cases ------>
// 1. No Auth : No authentication [Public API]
// 2. Basic Auth : User name and password required
// 3. Bearer token authentication
// 4. OAuth1 / OAuth2

// No Authentication required - Accessing a public API (Example: JSONPlaceholder)
// Response as per public API configuration.
test("1. No authentication test", async ({request}) => {
  const response = await request.get("https://jsonplaceholder.typicode.com/todos/1");
  expect(response.ok()).toBeTruthy;
  const responseBody = await response.json();
  console.log("Response Body ->",responseBody);
})

// Basic Authentication using username and password
/* Response is 200 ok and
{"authenticated": true,"user": "user"}*/
test("2. Basic authentication test", async ({request}) => {
  // https://httpbin.org/basic-auth/user/pass
  const response = await request.get("https://httpbin.org/basic-auth/user/pass",{
    headers:{
      Authorization:"basic "+Buffer.from("user:pass").toString('base64')
    }
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Response Body ->",responseBody);
})

// Bearer Token Authentication - Token passed in Authorization header
/* Response is 200 ok and
{"authenticated": true,"token": "your_bearer_token_here"} 
else 401 UNAUTHORIZED*/
test('3. Bearer Token Auth: Should access protected API using token', async ({ request }) => {
  
  const token = 'your_bearer_token_here'; // Replace with a valid token
  const response = await request.get('https://httpbin.org/bearer', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // Check if request was authenticated
  expect(body.authenticated).toBe(true);
  expect(body.token).toBe(token);
});

// OAuth2 - Access GitHub API with personal access token already created one.
test('4. OAuth2: GitHub API with OAuth2 token', async ({ request }) => {
  
  const oauthToken = process.env.GITHUB_AUTHTOKEN;
  const response = await request.get('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${oauthToken}`,
      'User-Agent': 'Playwright-Test'
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // Validate user info returned
  expect(body).toHaveProperty('login');
  console.log('Authenticated as:', body.login);
});

// OAuth2 - Access Auth0 API with access token accessible via id and secrets.
test('5. Auth2: API test with Auth0 token', async () => {
  // Step 1: Get OAuth2 token headers
  const headers = await getAuthHeaders({
    type: 'oauth2',
    oauth: {
      tokenUrl: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      audience: process.env.AUTH0_AUDIENCE!,
    },
  });

  // Step 2: Create request context with auth headers
  const context = await request.newContext({
    baseURL: 'https://httpbin.org', // Replace with your API endpoint
    extraHTTPHeaders: headers,
  });

  // Step 3: Make a secure API call
  const response = await context.get('/bearer'); // Adjust path as per your API

  // Step 4: Validate response
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  console.log('Response:', body);

  // Optional: more specific checks
  // expect(body.status).toBe('success');
});
