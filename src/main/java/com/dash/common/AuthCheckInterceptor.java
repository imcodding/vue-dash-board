package com.dash.common;

import com.dash.common.exception.JwtRuntimeException;
import com.dash.common.type.JwtCode;
import com.dash.common.type.TokenType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthCheckInterceptor implements HandlerInterceptor {

    private final JwtProvider jwtProvider;

    private static final String AUTHORIZATION_HEADER = "x-auth-token";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        log.info("Auth Check!!");

        if (request.getMethod().equals("OPTIONS")){
            return true;
        }

        //jqxfile upload시 axios 아닌 submit으로 header token 누락 이슈.. 예외처리
        if(request.getRequestURI().indexOf("/upload") == -1) {
            String authToken = resolveToken(request);
            return jwtProvider.validate(authToken, TokenType.ACCESS_TOKEN);
        }

        return true;

    }

    private String resolveToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token)) {
            return token;
        } else {
            throw new JwtRuntimeException(JwtCode.NO_TOKEN, JwtCode.NO_TOKEN.getDesc());
        }
    }
}
