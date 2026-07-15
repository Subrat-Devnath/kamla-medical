package com.security.config.authentication;

import java.io.IOException;
import java.util.Collections;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.security.client.dtos.SourceIdentity;
import com.security.config.utils.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.security.config.service.JwtService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String contentType = request.getContentType();

        String header = request.getHeader("Authorization");

        logger.info("Incoming request: method: {}, uri: {}, Content-Type: {}", method, uri, contentType);

        if (!StringUtils.hasText(header)) {
            logger.error("Header is null or empty");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.startsWith("Bearer ") ? header.substring(7) : header;

        if (!jwtService.isAccessToken(token)) {
            logger.error("Invalid Access Token");
            filterChain.doFilter(request, response);
            return;
        }

        Claims payload = jwtService.parse(token).getPayload();

        SourceIdentity sourceIdentity = SecurityUtil.getSecuredIdentity(payload);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(sourceIdentity, null,
                Collections.emptyList());

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            // Final line
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        logger.info("Authentication Set Successfully");
        filterChain.doFilter(request, response);
    }

    /*@Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.contains("/api/v1/login") ||
               uri.contains("/api/v1/validate/user") ||
               uri.contains("/api/v1/register-normal-user");
    }*/
}
