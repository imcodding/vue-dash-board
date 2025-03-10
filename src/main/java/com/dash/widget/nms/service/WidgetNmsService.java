package com.dash.widget.nms.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface WidgetNmsService {
    ReturnData getHighPerfByDev(Criterion criterion);

    ReturnData getHighTrafficByDev(Criterion criterion);

    ReturnData getHighTrafficByIfGrp(Criterion criterion);

    ReturnData getDevPerfChart(Criterion criterion);

    ReturnData getIfPerfChart(Criterion criterion);

    ReturnData getDevList(Criterion criterion);

    ReturnData getIfList(Criterion criterion);

    ReturnData getGrpDevList(Criterion criterion);
}
