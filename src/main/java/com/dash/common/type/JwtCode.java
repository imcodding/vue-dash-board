package com.dash.common.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Getter
@AllArgsConstructor
public enum JwtCode {

    NO_TOKEN("토큰이 없습니다."),
    INVALID_TOKEN("유효하지 않은 토큰입니다."),
    MALFORMED_TOKEN("위변조된 토큰입니다."),
    UNSUPPORTED_TOKEN("지원하지 않는 토큰입니다."),
    INVALID_COMPACT_TOKEN("유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN("토큰이 만료되었습니다."),
    NO_REFRESH_TOKEN("refresh 토큰이 없습니다."),
    INVALID_REFRESH_TOKEN("유효하지 않은 refresh 토큰입니다."),
    MALFORMED_REFRESH_TOKEN("위변조된 refresh 토큰입니다."),
    UNSUPPORTED_REFRESH_TOKEN("지원하지 않는 refresh 토큰입니다."),
    INVALID_COMPACT_REFRESH_TOKEN("유효하지 않은 refresh 토큰입니다."),
    EXPIRED_REFRESH_TOKEN("refresh 토큰이 만료되었습니다.")
    ;

    private final String desc;
}
