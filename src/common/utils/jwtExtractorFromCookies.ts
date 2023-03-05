import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

export const jwtUserTokenFromCookie: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['userAccessToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};

export const jwtAdminTokenFromCookie: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['adminAccessToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};

export const jwtRefreshTokenFromCookie: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['refreshToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};
