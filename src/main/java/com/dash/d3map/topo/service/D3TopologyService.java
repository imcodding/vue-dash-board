package com.dash.d3map.topo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface D3TopologyService {
    String getVersion();

    ReturnData getTopoEnvSetting(Criterion criterion);

    ReturnData getTopoItemList(Criterion criterion);

    ReturnData getTopoLinkList(Criterion criterion);

    ReturnData getTopoGrpInfo(Criterion criterion);

    ReturnData getMapTopGrpInfo(Criterion criterion);

    ReturnData getParentGrpNo(Criterion criterion);

    ReturnData getSplineToolList(Criterion criterion);

    ReturnData getDrawToolList(Criterion criterion);

}
