export const azureConfig = {
  appId: import.meta.env.VITE_REACT_APP_AZURE_CLIENT_ID,
  redirectURL: "http://localhost:5173",
  scopes: ["user.read"],
  authority: `https://login.microsoftonline.com/${
    import.meta.env.VITE_REACT_APP_AZURE_TENANT_ID
  }`,
};
