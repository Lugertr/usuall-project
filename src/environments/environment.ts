export const environment = {
  production: false,
  storeInfo: {
    token: process.env.STORE_TOKEN || '',
    user_email: process.env.STORE_USER_EMAIL || '',
    user_name: process.env.STORE_USER_NAME || '',
    user_id: Number(process.env.STORE_USER_ID) || 0,
    token2: process.env.STORE_TOKEN2 || '',
    email_confirmed: process.env.STORE_EMAIL_CONFIRMED === 'true',
    token3: process.env.STORE_TOKEN3 || '',
    insales_id: Number(process.env.STORE_INSALES_ID) || 0
  }
};
