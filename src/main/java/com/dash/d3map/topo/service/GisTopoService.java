package com.dash.d3map.topo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface GisTopoService {
    ReturnData getGroupInfo(Criterion criterion);
    ReturnData getGisItemList(Criterion criterion);
    ReturnData saveItemLatLnt(Criterion criterion);
    ReturnData saveGroupLatLnt(Criterion criterion);

}
