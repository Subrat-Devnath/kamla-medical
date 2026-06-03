package com.security.config.service.impl;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;

@Service
@Getter
public class CookieServiceImpl {

    private final String accessTokenCookieName;
    private final String refreshTokenCookieName;

    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;

    private final String cookieDomain;
    private final String cookieSameSite;

    public CookieServiceImpl(@Value("${security.jwt.access-token-cookie-name}") String accessTokenCookieName, @Value("${security.jwt.refresh-token-cookie-name}") String refreshTokenCookieName, @Value("${security.jwt.cookie-http-only}") boolean cookieHttpOnly, @Value("${security.jwt.cookie-secure}") boolean cookieSecure, @Value("${security.jwt.cookie-domain}") String cookieDomain, @Value("${security.jwt.cookie-same-site}") String cookieSameSite) {
        this.accessTokenCookieName = accessTokenCookieName;
        this.refreshTokenCookieName = refreshTokenCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookieDomain = cookieDomain;
        this.cookieSameSite = cookieSameSite;
    }


    public void attachRefreshTokenToCookie(HttpServletResponse response, String value, int maxAge) {
        // Implementation to attach the refresh token to a cookie
        ResponseCookie responseCookie = ResponseCookie.from(refreshTokenCookieName, value)
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .domain(cookieDomain)
                .sameSite(cookieSameSite)
                .maxAge(maxAge)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

    }

    public void attachAccessTokenToCookie(HttpServletResponse response, String value, int maxAge) {
        // Implementation to attach the access token to a cookie
        ResponseCookie responseCookie = ResponseCookie.from(accessTokenCookieName, value)
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .domain(cookieDomain)
                .sameSite(cookieSameSite)
                .maxAge(maxAge)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void clearRefreshTokenCookie(HttpServletResponse response) {
        // Implementation to clear the refresh token cookie
        ResponseCookie responseCookie = ResponseCookie.from(refreshTokenCookieName, "")
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .domain(cookieDomain)
                .sameSite(cookieSameSite)
                .maxAge(0)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void clearAccessTokenCookie(HttpServletResponse response) {
        // Implementation to clear the access token cookie
        ResponseCookie responseCookie = ResponseCookie.from(accessTokenCookieName, "")
                .httpOnly(cookieHttpOnly)
                .secure(cookieSecure)
                .domain(cookieDomain)
                .sameSite(cookieSameSite)
                .maxAge(0)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
    }

    public void addNoHeaderForCookie(HttpServletResponse response) {
        response.addHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        response.addHeader(HttpHeaders.PRAGMA, "no-cache");
    }
}
