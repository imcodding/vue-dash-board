package com.dash.conf.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface DashConfService {
    ReturnData getConf(Criterion criterion);

    ReturnData getConfList(Criterion criterion);

    ReturnData addConf(Criterion criterion);

    ReturnData editConf(Criterion criterion);

    ReturnData delConf(Criterion criterion);

    ReturnData saveConf(Criterion criterion);

    ReturnData saveConfList(Criterion criterion);
}
