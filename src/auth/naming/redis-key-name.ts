export const emailAuthCodeRedisKey = (email) => `emailCerti_${email}`;

export const refreshTokenRedisKey = (userTypeString: string, id: number) => {
  return `${userTypeString}_${id}`;
};
