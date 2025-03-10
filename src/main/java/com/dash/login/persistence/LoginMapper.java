package com.dash.login.persistence;

import com.dash.common.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository(value = "loginMapper")
@Mapper
public interface LoginMapper {
    User selectUserInfoById(String userId);

    String selectSaltById(String userId);

    User selectUserInfo(Map<String, Object> condition);

    void updateLoginFail(String userId);

    void updateLoginSuccess(String userId);

    void insertLoginHistory(User userDto);

    int updateLogoutHistory(User dto);

    String selectRefreshToken(String userId);
    void updateRefreshToken(String refreshToken);
}
