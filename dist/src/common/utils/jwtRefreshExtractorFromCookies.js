"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtRefreshExtractorFromCookies = void 0;
const jwtRefreshExtractorFromCookies = (request) => {
    try {
        const jwt = request.cookies['refreshToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtRefreshExtractorFromCookies = jwtRefreshExtractorFromCookies;
//# sourceMappingURL=jwtRefreshExtractorFromCookies.js.map