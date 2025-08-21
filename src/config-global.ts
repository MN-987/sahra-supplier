// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;

// Ensure HTTPS in production
const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  
  // If we're in production and URL is HTTP, convert to HTTPS
  if (import.meta.env.PROD && envURL?.startsWith('http://')) {
    return envURL.replace('http://', 'https://');
  }
  
  return envURL;
};

export const API_BASE_URL = getAPIBaseURL();
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const FIREBASE_API = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: import.meta.env.VITE_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'