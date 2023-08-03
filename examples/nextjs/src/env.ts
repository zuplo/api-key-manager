export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Sets the sample fallbacks are for demo purposes only,
// they should be removed in your deployment
const vars: Record<string, string> = {
  NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ??
    "zuplo-samples.us.auth0.com",
  NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ??
    "OFNbP5hhtsCHkBsXHEtWO72kKQvJtgI3",
  NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ??
    "https://api.example.com/",

  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  // TODO: Deploy the final sample version in order to have a default
  //   ??"https://sample-api-key-auth-translation-main-1e90fe1.d2.zuplo.dev",
};

export function getRequiredEnvVar(name: string): string {
  const val = vars[name];
  if (!val) {
    throw new Error(`The environment variable '${name}' must be set.`);
  }
  return val;
}
