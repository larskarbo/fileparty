import ky from "ky";

export const BASE = `/.netlify/functions/`;

export let isNode;

try {
  isNode = typeof window == "undefined";
} catch (e) {
  isNode = true;
}

export const isLocal = () => {
  if (isNode) {
    return process.env.NODE_ENV == "development";
  }
  return typeof location != "undefined" && location?.host?.includes("localhost");
};

export const SERVER_BASE = isLocal() ? `http://localhost:3210` : `https://server.fileparty.co`


let headers = {};

// export const stripe = window.Stripe(Constants.manifest.extra.STRIPE_PUB_KEY)

// export function generateHeaders(token) {
//   headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// }

export function request(method, functionName, data?) {
  return ky(BASE + functionName, {
    method: method,
    json: data,
    headers,
  }).json()
  .catch(async error => {
    
  
    throw new Error(`${functionName} statusCode:${error.response?.status} ${error.message} ${(await error.response?.json())?.error?.message}`);

  })
}
