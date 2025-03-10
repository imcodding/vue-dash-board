package com.dash.common;

import com.dash.common.exception.JwtRuntimeException;
import com.dash.common.type.JwtCode;
import com.dash.common.type.TokenType;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.sql.Date;
import java.time.ZonedDateTime;

/**
 * @author sooyun, imhojung
 * @since 2023.07.09
 */
@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;
    private Key key;

    private final static long tokenExpiredTime = 60; //만료시간 1분
    private final static long refreshTokenExpiredTime = 60 * 60 * 24 * 14; //만료시간 2주

    @PostConstruct
    protected void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String createToken(String userId, String userName, TokenType type) {
        final ZonedDateTime now = ZonedDateTime.now();
        long time = type == TokenType.ACCESS_TOKEN ? tokenExpiredTime : refreshTokenExpiredTime;

        return Jwts.builder()
                .claim("userId", userId)
                .claim("userName", userName)
                .signWith(key, SignatureAlgorithm.HS256)
                .setIssuedAt(Date.from(now.toInstant()))
//                .setExpiration(Date.from(now.toInstant().plusSeconds(time)))
                .compact();
    }

    public boolean validate(String token, TokenType type) {
        return type == TokenType.ACCESS_TOKEN ? getAccessTokenData(token) != null : getRefreshTokenData(token) != null;
    }

    public Claims getAccessTokenData(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (SecurityException e) {
            throw new JwtRuntimeException(JwtCode.INVALID_TOKEN, JwtCode.INVALID_TOKEN.getDesc());
        } catch (MalformedJwtException e) {
            throw new JwtRuntimeException(JwtCode.MALFORMED_TOKEN, JwtCode.MALFORMED_TOKEN.getDesc());
        } catch (ExpiredJwtException e) {
            throw new JwtRuntimeException(JwtCode.EXPIRED_TOKEN, JwtCode.EXPIRED_TOKEN.getDesc());
        } catch (UnsupportedJwtException e) {
            throw new JwtRuntimeException(JwtCode.UNSUPPORTED_TOKEN, JwtCode.UNSUPPORTED_TOKEN.getDesc());
        } catch (IllegalArgumentException e) {
            throw new JwtRuntimeException(JwtCode.INVALID_COMPACT_TOKEN, JwtCode.INVALID_COMPACT_TOKEN.getDesc());
        }
    }

    public Claims getRefreshTokenData(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (SecurityException e) {
            throw new JwtRuntimeException(JwtCode.INVALID_REFRESH_TOKEN, JwtCode.INVALID_REFRESH_TOKEN.getDesc());
        } catch (MalformedJwtException e) {
            throw new JwtRuntimeException(JwtCode.MALFORMED_REFRESH_TOKEN, JwtCode.MALFORMED_REFRESH_TOKEN.getDesc());
        } catch (ExpiredJwtException e) {
            throw new JwtRuntimeException(JwtCode.EXPIRED_REFRESH_TOKEN, JwtCode.EXPIRED_REFRESH_TOKEN.getDesc());
        } catch (UnsupportedJwtException e) {
            throw new JwtRuntimeException(JwtCode.UNSUPPORTED_REFRESH_TOKEN, JwtCode.UNSUPPORTED_REFRESH_TOKEN.getDesc());
        } catch (IllegalArgumentException e) {
            throw new JwtRuntimeException(JwtCode.INVALID_COMPACT_REFRESH_TOKEN, JwtCode.INVALID_COMPACT_REFRESH_TOKEN.getDesc());
        }
    }
}
