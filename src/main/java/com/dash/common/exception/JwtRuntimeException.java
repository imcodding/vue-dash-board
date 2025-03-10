package com.dash.common.exception;

import com.dash.common.type.JwtCode;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Getter
public class JwtRuntimeException extends RuntimeException {

    private JwtCode code;
    public JwtRuntimeException(String message) {
        super(message);
    }

    public JwtRuntimeException(JwtCode code, String message) {
        super(message);
        this.code = code;
    }
}
