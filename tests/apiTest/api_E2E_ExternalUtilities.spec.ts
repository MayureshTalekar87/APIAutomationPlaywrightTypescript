import { test, expect } from "@playwright/test";
import { readJson } from "../../utils/jsonUtils";
import {
  createBooking,
  createToken,
  updateBooking,
  deleteBooking,
} from "../../utils/bookingAPI";

test("Create, update, and delete booking - End to end", async ({ request }) => {
  // Create booking
  const bookingData = readJson("testdata/post_request_body.json");
  const createResponse = await createBooking(request, bookingData);
  expect(createResponse.ok()).toBeTruthy();

  const { bookingid } = await createResponse.json();
  console.log("Booking ID:", bookingid);

  // Create token
  const tokenData = readJson("testdata/token_request_body.json");
  const tokenResponse = await createToken(request, tokenData);
  expect(tokenResponse.ok()).toBeTruthy();

  const { token } = await tokenResponse.json();
  console.log("Token:", token);

  // Update booking
  const updateData = readJson("testdata/patch_request_body.json");
  const updateResponse = await updateBooking(request, bookingid, token, updateData);
  expect(updateResponse.ok()).toBeTruthy();
  expect(updateResponse.status()).toBe(200);
  console.log("Booking updated successfully");

  // Delete booking
  const deleteResponse = await deleteBooking(request, bookingid, token);
  expect(deleteResponse.status()).toBe(201);
  expect(deleteResponse.statusText()).toBe("Created");
  console.log("Booking deleted successfully");
});