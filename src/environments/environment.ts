export const environment = {
  production: false,
  storeInfo: {
    token: import.meta.env.NG_APP_TOKEN || '',
    user_email: import.meta.env.NG_APP_USER_EMAIL || '',
    user_name: import.meta.env.NG_APP_USER_NAME || '',
    user_id: Number(import.meta.env.NG_APP_USER_ID) || 0,
    token2: import.meta.env.NG_APP_TOKEN2 || '',
    email_confirmed: import.meta.env.NG_APP_EMAIL_CONFIRMED === 'true',
    token3: import.meta.env.NG_APP_TOKEN3 || '',
    insales_id: Number(import.meta.env.NG_APP_INSALES_ID) || 0
  }
};
