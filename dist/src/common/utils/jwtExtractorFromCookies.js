"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtExtractorFromCookies = void 0;
const jwtExtractorFromCookies = (request) => {
    try {
        const jwt = request.cookies['accessToken'];
        return jwt;
    }
    catch (error) {
        return null;
    }
};
exports.jwtExtractorFromCookies = jwtExtractorFromCookies;
//# sourceMappingURL=jwtExtractorFromCookies.js.map