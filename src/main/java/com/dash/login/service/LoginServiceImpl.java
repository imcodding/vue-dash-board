package com.dash.login.service;

import com.dash.common.JwtProvider;
import com.dash.common.encrypt.ShaEncrypt;
import com.dash.common.exception.CustomException;
import com.dash.common.exception.JwtRuntimeException;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.common.model.User;
import com.dash.common.type.ErrorCode;
import com.dash.common.type.JwtCode;
import com.dash.common.type.TokenType;
import com.dash.login.persistence.LoginMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.jdbc.Null;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service("loginService")
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    @Resource(name = "loginMapper")
    private LoginMapper mapper;

    private final JwtProvider jwtProvider;

    @Override
    public ReturnData login(Criterion criterion) throws Exception {
        String userId = String.valueOf(criterion.getValue("userId"));
        String password = String.valueOf(criterion.getValue("password"));

        // 패스워드 암호화
        String salt = mapper.selectSaltById(criterion.getValue("userId").toString());

        try {
            ShaEncrypt shaEncrypt = new ShaEncrypt();
            String nPwd = shaEncrypt.encryptWithSalt(ShaEncrypt.ShaAlgorithmType.SHA256, password, salt.getBytes());
            criterion.addParam("password", nPwd);
        } catch (NullPointerException c) {
            throw new CustomException(ErrorCode.NOT_MATCHED.getDesc());
        }

        // DB 확인
        User user = mapper.selectUserInfo(criterion.getCondition());

        if (user == null) {
            mapper.updateLoginFail(userId);
            throw new CustomException(ErrorCode.NO_USER.getDesc());
        } else if (user.getUseFlag() != 1 && !user.getAuth().equals("System")) {
            throw new CustomException(ErrorCode.NO_AUTH.getDesc());
        }

        // 로그인실패 클리어
        mapper.updateLoginSuccess(userId);
        user.setUuid(UUID.randomUUID().toString().toUpperCase());

        //토큰 생성
        String accessToken = jwtProvider.createToken(user.getUserId(), user.getUserName(), TokenType.ACCESS_TOKEN);
        String refreshToken = jwtProvider.createToken(user.getUserId(), user.getUserName(), TokenType.REFRESH_TOKEN);
        mapper.updateRefreshToken(refreshToken);

        // 부가정보 셋팅
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("status", 200);
        resultMap.put("token", accessToken);
        resultMap.put("userId", user.getUserId());
        resultMap.put("userName", user.getUserName());

        return new ReturnData(resultMap);
    }

    @Override
    public ReturnData updateExpiredToken(Criterion criterion) {

        String userId = String.valueOf(criterion.getValue("userId"));

        User user = mapper.selectUserInfoById(userId);
        if(user == null) throw new CustomException(ErrorCode.NO_USER, ErrorCode.NO_USER.getDesc());

        //refresh 토큰 확인(컬럼 생성 후, 수정 예정)
        String refreshToken = mapper.selectRefreshToken(userId);
        if(refreshToken == null || StringUtils.isBlank(refreshToken))
            throw new JwtRuntimeException(JwtCode.NO_REFRESH_TOKEN, JwtCode.NO_REFRESH_TOKEN.getDesc());

        jwtProvider.validate(refreshToken, TokenType.REFRESH_TOKEN);

        //refresh 토근 유효 -> 토큰 재발급
        String accessToken = jwtProvider.createToken(userId, user.getUserName(), TokenType.ACCESS_TOKEN);

        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("token", accessToken);
        resultMap.put("userId", user.getUserId());
        resultMap.put("userName", user.getUserName());

        return new ReturnData(resultMap);
    }
}
