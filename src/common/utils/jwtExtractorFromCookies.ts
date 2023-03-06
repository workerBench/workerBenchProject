import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

// 유저 access token
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

// 유저 refresh token
export const jwtUserRefreshTokenFromCookie: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['refreshToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};

// 관리자 access token
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

// 관리자 refresh token
export const jwtAdminRefreshTokenFromCookie: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const jwt = request.cookies['adminRefreshToken'];
    return jwt;
  } catch (error) {
    return null;
  }
};
