export const oidcConfig = {
  scope: "openid profile",
  responseType: "code",
  authority: import.meta.env.VITE_OPENID_AUTHORITY,
  clientId: import.meta.env.VITE_OPENID_CLIENT_ID,
  clientSecret: import.meta.env.VITE_OPENID_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_OPENID_REDIRECT_URL,
};
