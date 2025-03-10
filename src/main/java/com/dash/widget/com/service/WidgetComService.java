package com.dash.widget.com.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface WidgetComService {

    String getVersion();

    ReturnData getEvtStatus(Criterion criterion);

    ReturnData getD3TopoGrpTreeList(Criterion criterion);

    ReturnData getGrpTreeList(Criterion criterion);
}
