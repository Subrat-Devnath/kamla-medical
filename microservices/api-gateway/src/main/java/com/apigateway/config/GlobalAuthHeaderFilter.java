package com.apigateway.config;

import com.apigateway.constants.ApiGatewayConstants;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
public class GlobalAuthHeaderFilter extends AbstractGatewayFilterFactory<GlobalAuthHeaderFilter.Config> {

    public GlobalAuthHeaderFilter() {
        super(Config.class);
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            String accessToken = null;
            if (request.getCookies().get("accessToken") != null) {
                accessToken = request.getCookies().get("accessToken").get(0).getValue();

                // YSP-43840: Spring boot version upgrade and java 17 upgrade

                // request.mutate().header(HttpHeaders.AUTHORIZATION, accessToken);

                // Create a new ServerHttpRequest with the additional header
                ServerHttpRequest modifiedRequest = request.mutate().header(HttpHeaders.AUTHORIZATION, accessToken).build();

                // Replace the exchange with the new request
                exchange = exchange.mutate().request(modifiedRequest).build();
            }
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, ApiGatewayConstants.ERROR_MESSAGE_HEADER, HttpStatus.UNAUTHORIZED);
            }
            String authorizationHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            accessToken = authorizationHeader.replace("Bearer ", "");

            if (!isJwtValid(accessToken)) {
                return onError(exchange, ApiGatewayConstants.JWT_INVALID_MESSAGE, HttpStatus.UNAUTHORIZED);
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);

        return response.setComplete();
    }

    private boolean isJwtValid(String jwt) {
        Object requestObject = null;
        org.springframework.http.HttpHeaders reqHeaders = new org.springframework.http.HttpHeaders();
        Map<String, String> reqHeaderMap = new HashMap<String, String>();
        //YSP-49330: As per discussion with Bhuvnesh, we are going to use a constant from the HttpHeaders or HeaderConstants file instead of hardcoded values.
        reqHeaderMap.put(HttpHeaders.AUTHORIZATION, jwt);
        reqHeaderMap.put(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        reqHeaders.setAll(reqHeaderMap);
        HttpEntity<?> reqEntity = new HttpEntity(requestObject, reqHeaders);

//         ResponseEntity<Boolean> responseEntity = reqRestTemplate.exchange("http://172.16.1.15:8109/security/validatetoken", HttpMethod.GET, reqEntity, Boolean.class);
       /* ResponseEntity<Boolean> responseEntity = reqRestTemplate.exchange("http://user-mgmt:8084/user-mgmt/validatetoken", HttpMethod.GET, reqEntity, Boolean.class);
        if (responseEntity == null || responseEntity.getBody() == null) {
            return false;
        }
*/
        return true;
    }

}