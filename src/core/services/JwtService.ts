const ID_TOKEN_KEY = "id_token" as string;
const ID_REFRESH_TOKEN_KEY = "id_refresh_token" as string;
const ID_TENANT_KEY = "id_tenant" as string;
const ID_SESSION_KEY = "id_session" as string;
/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get token form localStorage
 */
export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem(ID_REFRESH_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveRefreshToken = (token: string): void => {
  window.localStorage.setItem(ID_REFRESH_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyRefreshToken = (): void => {
  window.localStorage.removeItem(ID_REFRESH_TOKEN_KEY);
};


export const setTenant = (tenant: string): void => {
  window.localStorage.setItem(ID_TENANT_KEY, tenant);
};

export const getTenant = (): string | null => {
  return window.localStorage.getItem(ID_TENANT_KEY);
};

export const destroyTenant = (): void => {
  window.localStorage.removeItem(ID_TENANT_KEY);
};

export const setSessionKey = (sessionKey: string): void => {
  window.localStorage.setItem(ID_SESSION_KEY, sessionKey);
};

export const getSessionKey = (): string | null => {
  return window.localStorage.getItem(ID_SESSION_KEY);
};

export const destroySessionKey = (): void => {
  window.localStorage.removeItem(ID_SESSION_KEY);
};

export default { getRefreshToken, saveRefreshToken, destroyRefreshToken, getToken, saveToken, destroyToken, setTenant, getTenant, destroyTenant, getSessionKey, setSessionKey, destroySessionKey };
