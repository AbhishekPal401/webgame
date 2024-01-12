// export const azureConfig = {
//   appId: import.meta.env.VITE_REACT_APP_AZURE_CLIENT_ID,
//   redirectURL: "http://localhost:5173",
//   scopes: ["openid", "user.read", "email"],
//   authority: `https://login.microsoftonline.com/${
//     import.meta.env.VITE_REACT_APP_AZURE_TENANT_ID
//   }`,
// };

//pwc
export const azureConfig = {
  appId: import.meta.env.VITE_REACT_APP_AZURE_CLIENT_ID,
  redirectURL: "https://ipziqnguaswa001.azurewebsites.net",
  scopes: ["openid", "email"],
  authority: `https://login-stg.pwc.com/${
    import.meta.env.VITE_REACT_APP_AZURE_TENANT_ID
  }`,
};
