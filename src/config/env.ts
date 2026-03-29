import Config from 'react-native-config';

const getRequiredEnv = (key: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY') => {
  const value = Config[key];

  if (!value) {
    throw new Error(
      `Missing ${key}. Add it to your .env file before starting the app.`,
    );
  }

  return value;
};

export const env = {
  supabaseUrl: getRequiredEnv('SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('SUPABASE_ANON_KEY'),
};
