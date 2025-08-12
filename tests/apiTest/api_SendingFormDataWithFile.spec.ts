import { test, expect, request } from '@playwright/test';
import * as fs from 'fs';

// Test case: sending File with form data -->
test('httpbin: multipart form-data with file and field', async () => {
  const apiContext = await request.newContext();

  const buffer = fs.readFileSync('testdata/petslover.xml');

  const response = await apiContext.post('https://httpbin.org/post', {
    multipart: {
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
