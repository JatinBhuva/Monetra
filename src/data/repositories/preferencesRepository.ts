import { LocalPreferencesRepository } from './preferencesRepository.local';

export type PreferencesRepository = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
};

export const preferencesRepository: PreferencesRepository =
  new LocalPreferencesRepository();
