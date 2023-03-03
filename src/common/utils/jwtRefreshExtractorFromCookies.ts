import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

export const jwtRefreshExtractorFromCookies: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['refreshToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};
