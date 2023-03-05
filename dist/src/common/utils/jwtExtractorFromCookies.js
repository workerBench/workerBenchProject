"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtRefreshTokenFromCookie = exports.jwtAdminTokenFromCookie = exports.jwtUserTokenFromCookie = void 0;
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
const jwtRefreshTokenFromCookie = (request) => {
    try {
        const jwt = request.cookies['refreshToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtRefreshTokenFromCookie = jwtRefreshTokenFromCookie;
//# sourceMappingURL=jwtExtractorFromCookies.js.map