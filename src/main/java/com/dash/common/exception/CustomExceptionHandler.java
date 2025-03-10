package com.dash.common.exception;

import com.dash.common.model.ReturnData;
import com.dash.common.type.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CustomExceptionHandler {

    private final HashMap<String, Object> errorResult;
    @ExceptionHandler
    public ReturnData handleJwtException(JwtRuntimeException e) {
        errorResult.put("code", e.getCode());
        errorResult.put("message", e.getMessage());
        return new ReturnData(errorResult);
    }

    @ExceptionHandler
    public ReturnData handleCustomException(CustomException e) {
        errorResult.put("code", e.getCode());
        errorResult.put("message", e.getMessage());
        return new ReturnData(errorResult);
    }

    @ExceptionHandler(value = {
            HttpRequestMethodNotSupportedException.class,
            MethodArgumentNotValidException.class
    })
    public ReturnData handleBadRequest(Exception e, HttpServletRequest request) {
        log.error("url: {}, message: {}", request.getRequestURI(), e.getMessage());
        errorResult.put("code", ErrorCode.BAD_REQUEST);
        errorResult.put("message", e.getMessage());
        return new ReturnData(errorResult);
    }

    @ExceptionHandler(Exception.class)
    public ReturnData handleRequest(Exception e, HttpServletRequest request) {
        log.error("url: {}, message: {}", request.getRequestURI(), e.getMessage());
        errorResult.put("code", ErrorCode.INTERNAL_SERVER_ERROR);
        errorResult.put("message", e.getMessage());
        return new ReturnData(errorResult);
    }
}
