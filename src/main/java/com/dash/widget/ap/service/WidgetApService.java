package com.dash.widget.ap.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.common.type.Version;

import java.util.Map;

public interface WidgetApService {

    String getVersion();
    ReturnData getEvtTimeTopByAp(Criterion criterion);
    ReturnData getClientAnalysis(Criterion criterion);
    ReturnData getMaxCCUByTime(Criterion criterion);
    ReturnData getTrafficAnalysis(Criterion criterion);
    ReturnData getMaxTrafficByTime(Criterion criterion);
    ReturnData getHighTrafficByClient(Criterion criterion);
    ReturnData getHighTrafficByAp(Criterion criterion);
    ReturnData getLowTrafficByAp(Criterion criterion);
    ReturnData getHighClientByAp(Criterion criterion);
    ReturnData getLowClientByAp(Criterion criterion);
    ReturnData getClientStateByOs(Criterion criterion);
    ReturnData getTrafficStateByOs(Criterion criterion);
    ReturnData getApStatus(Criterion criterion);

}
