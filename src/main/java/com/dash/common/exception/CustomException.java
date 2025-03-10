package com.dash.common.exception;

import com.dash.common.type.ErrorCode;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Getter
public class CustomException extends RuntimeException {

    private ErrorCode code;

    public CustomException(String message) {
        super(message);
    }

    public CustomException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
