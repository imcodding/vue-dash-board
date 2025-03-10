package com.dash.login.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

import java.util.Map;

public interface LoginService {
    ReturnData login(Criterion criterion) throws Exception;

    ReturnData updateExpiredToken(Criterion criterion);
}
