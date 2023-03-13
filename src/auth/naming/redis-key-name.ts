// 회원가입을 위한 이메일 인증 코드
export const emailAuthCodeRedisKey = (email: string) => `emailCerti_${email}`;

// 비밀번호 재설정을 위한 이메일 인증 코드
export const emailAuthCodeRedisKeyForResetPs = (email: string) => {
  return `emailCertiForResetPs_${email}`;
};

/*
비밀번호 재설정을 위한 이메일 인증 코드 통과 후, 
해당 유저가 비밀번호 재설정 절차에 들어갔음을 알려주기 위해 redis 에 남길 데이터의 키
*/
export const thisUserOnTheWayToChangePs = (email: string, id: number) => {
  return `changingPs_${id}_${email}`;
};

export const refreshTokenRedisKey = (userTypeString: string, id: number) => {
  return `${userTypeString}_${id}`;
};
