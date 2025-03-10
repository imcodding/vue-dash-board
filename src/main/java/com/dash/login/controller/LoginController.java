package com.dash.login.controller;

import com.dash.common.exception.CustomException;
import com.dash.common.model.Criterion;
import com.dash.common.model.ErrorInfo;
import com.dash.common.model.ReturnData;
import com.dash.common.type.ErrorCode;
import com.dash.login.service.LoginService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Resource(name="loginService")
    private LoginService service;

    @PostMapping
    public ReturnData login(@RequestBody Map<String, Object> reqMap, HttpServletRequest request) {
        try {
            Criterion criterion = new Criterion(reqMap);

            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = new Date();
            criterion.addParam("loginDateTime", dateFormat.format(date));

            return service.login(new Criterion(reqMap));
        } catch(Exception e) {
            e.printStackTrace();
            throw new CustomException(ErrorCode.NOT_MATCHED.getDesc());
        }
    }

    /**
     * 만료된 토큰 재발급
     */
    @PostMapping("updateToken")
    public ReturnData updateExpiredToken(@RequestBody Map<String, Object> reqMap) {
        return service.updateExpiredToken(new Criterion(reqMap));
    }
}
