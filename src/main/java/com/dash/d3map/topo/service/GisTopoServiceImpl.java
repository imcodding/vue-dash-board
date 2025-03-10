package com.dash.d3map.topo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.d3map.topo.persistence.GisTopoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("gisTopoService")
@Transactional
public class GisTopoServiceImpl implements GisTopoService {

    @Resource(name = "gisTopoMapper")
    private GisTopoMapper mapper;

    @Override
    public ReturnData getGroupInfo(Criterion criterion) {
        return new ReturnData(mapper.selectGroupInfo(criterion.getCondition()));
    }

    @Override
    public ReturnData getGisItemList(Criterion criterion) {
        return new ReturnData(mapper.selectGisItemList(criterion.getCondition()));
    }

    @Override
    public ReturnData saveItemLatLnt(Criterion criterion) {
        mapper.updateItemLatLnt(criterion.getCondition());
        return new ReturnData();
    }

    @Override
    public ReturnData saveGroupLatLnt(Criterion criterion) {
        mapper.updateGroupLatLng(criterion.getCondition());
        return new ReturnData();
    }
}
