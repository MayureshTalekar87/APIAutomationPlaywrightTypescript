APIAutomationPlaywright ===>

A basic API automation framework built using Playwright with TypeScript, featuring reusable components for scalable and maintainable test development. 

This framework is designed to support automated API testing with modular utilities, environment-specific configurations, and reusable authentication handling for services like GitHub and Auth0. 

==============================================

Features ===>

Modular and reusable components  

Environment-based test execution  

Easy setup and execution with Playwright  

Supports multiple authentication types including Bearer, Basic, API Key, and OAuth2 

==============================================

Prerequisites ===>

Make sure you have Node.js installed. Then, install all required dependencies using: 

npm install 

============================================== 

Running Tests ===>

To execute all test cases on the QA environment, use the following commands based on your terminal: 

Command Prompt (CMD) =>

To execute all test cases ->
set ENV=qa && npx playwright test 

To execute specific tests from ts file ->
Set ENV=qa && npx playwright test "tests/apiTest/api_E2E_ExternalUtilities.spec.ts" 

  

PowerShell =>

$env:ENV="qa"; npx playwright test 

============================================== 

Environment Variables Setup ===>

Create a .env file in the root folder of your project and add the following credentials for GitHub and Auth0 integrations:  

Pre-requisite: Free Auth0 API and GitHub token is already setup 

GitHub credentials -->

GITHUB_AUTHTOKEN="your_GitHub_Token_Here" 
GITHUB_USERNAME="your_GitHub_UserName_or_emailAddress_Here" 
GITHUB_PASSWORD="your_GitHub_password_Here" 
GITHUB_CLIENT_ID="your_GitHub_ClientID_Here" 
GITHUB_CLIENT_SECRET="your_GitHub_ClientSecret_Here" 

Auth0 credentials -->

AUTH0_CLIENT_ID="your_Auth0_ClientID_Here" 
AUTH0_CLIENT_SECRET="your_Auth0_ClientSecret_Here" 
AUTH0_DOMAIN="your_Auth0_Domain_Here" 
AUTH0_AUDIENCE="your_Auth0_TargetAudience_Here" 

 ==============================================

NOTE: Ensure that your .env file is listed in .gitignore to avoid accidentally committing sensitive credentials. 
