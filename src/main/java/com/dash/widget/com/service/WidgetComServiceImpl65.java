package com.dash.widget.com.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.common.type.Version;
import com.dash.widget.com.persistence.WidgetComMapperV65;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("widgetComServiceV65")
@Transactional
public class WidgetComServiceImpl65 implements WidgetComService {

    @Resource(name = "widgetComMapperV65")
    private WidgetComMapperV65 mapper;

    @Override
    public String getVersion() {
        return Version.VER_65.getDesc();
    }

    @Override
    public ReturnData getEvtStatus(Criterion criterion) {
        String type = String.valueOf(criterion.getValue("selectType"));
        if(type.equals("count")) {
            return new ReturnData(mapper.selectEvtCnt(criterion.getCondition()));
        } else {
            return new ReturnData(mapper.selectEvtStatusList(criterion.getCondition()));
        }
    }

    @Override
    public ReturnData getD3TopoGrpTreeList(Criterion criterion) {
        return new ReturnData(mapper.selectD3TopoGrpTreeList(criterion.getCondition()));
    }

    @Override
    public ReturnData getGrpTreeList(Criterion criterion) {
        return new ReturnData(mapper.selectGrpTreeList(criterion.getCondition()));
    }
}
