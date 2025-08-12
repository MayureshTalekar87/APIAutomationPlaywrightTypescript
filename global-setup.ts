// This script runs once before all tests and sets runtime environment variables.
// config object coming from 'playwright.config.ts' and consits of all the configurations for test execution.
import { FullConfig } from '@playwright/test';
import { environments } from './config/environment';

async function globalSetup(config: FullConfig) {
  const ENV = (process.env.ENV || 'dev').trim();
  const envConfig = environments[ENV];

  process.env.BOOKING_API = envConfig.bookingAPI;
  process.env.AUTH_API = envConfig.authAPI;
  process.env.XML_AS_FORM_API = envConfig.xmlAsFormAPI;
}

export default globalSetup;
