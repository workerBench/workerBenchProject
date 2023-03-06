"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAdminRefreshTokenFromCookie = exports.jwtAdminTokenFromCookie = exports.jwtUserRefreshTokenFromCookie = exports.jwtUserTokenFromCookie = void 0;
const jwtUserTokenFromCookie = (request) => {
    try {
        const jwt = request.cookies['userAccessToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtUserTokenFromCookie = jwtUserTokenFromCookie;
const jwtUserRefreshTokenFromCookie = (request) => {
    try {
        const jwt = request.cookies['refreshToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtUserRefreshTokenFromCookie = jwtUserRefreshTokenFromCookie;
const jwtAdminTokenFromCookie = (request) => {
    try {
        const jwt = request.cookies['adminAccessToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtAdminTokenFromCookie = jwtAdminTokenFromCookie;
const jwtAdminRefreshTokenFromCookie = (request) => {
    try {
        const jwt = request.cookies['adminRefreshToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtAdminRefreshTokenFromCookie = jwtAdminRefreshTokenFromCookie;
//# sourceMappingURL=jwtExtractorFromCookies.js.map