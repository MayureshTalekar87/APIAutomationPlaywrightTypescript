import { APIRequestContext } from "@playwright/test";

const baseURL = process.env.BOOKING_API;
const authURL = process.env.AUTH_API;

export async function createBooking(request: APIRequestContext, data: any) {
  return await request.post(`${baseURL}/booking`, { data });
}

export async function createToken(request: APIRequestContext, data: any) {
  return await request.post(`${authURL}/auth`, { data });
}

export async function updateBooking(
  request: APIRequestContext,
  bookingId: number,
  token: string,
  data: any
) {
  return await request.patch(`${baseURL}/booking/${bookingId}`, {
    headers: { cookie: `token=${token}` },
    data,
  });
}

export async function deleteBooking(
  request: APIRequestContext,
  bookingId: number,
  token: string
) {
  return await request.delete(`${baseURL}/booking/${bookingId}`, {
    headers: { cookie: `token=${token}` },
  });
}
