package com.dash.common.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    NO_USER("등록되지 않은 사용자입니다."),
    NO_AUTH("권한이 없습니다."),
    CHECK_ID("아이디를 확인해주세요."),
    CHECK_PWD("패스워드를 확인해주세요."),
    NOT_MATCHED("아이디 또는 비밀번호가 일치하지 않습니다."),
    BAD_REQUEST("잘못된 요청입니다."),
    INTERNAL_SERVER_ERROR("서버에서 에러가 발생했습니다."),
    ;
    private final String desc;

}
