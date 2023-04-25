export const getRedirectUrl = (clientId: string) => {
  const parts = clientId.split('.');
  return `com.googleusercontent.apps.${parts[0]}:/oauthredirect`;
};
