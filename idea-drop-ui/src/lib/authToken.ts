let accessToken: string | null = null;

export const setStoredAccessToken = (token: string | null) => {
  //   console.log(`vai gravar token ${token}`);
  accessToken = token;
};

export const getStoredAccessToken = () => accessToken;
