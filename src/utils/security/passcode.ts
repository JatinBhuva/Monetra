const PASSCODE_REGEX = /^\d{4}$/;

export const isValidPasscode = (value: string) => PASSCODE_REGEX.test(value);

export const hashPasscode = (value: string) => {
  let hash = 5381;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }

  return `pc_${(hash >>> 0).toString(16)}`;
};

export const verifyPasscode = (plain: string, hashed: string | null) => {
  if (!hashed) {
    return false;
  }

  return hashPasscode(plain) === hashed;
};
