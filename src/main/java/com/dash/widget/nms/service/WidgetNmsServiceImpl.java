package com.dash.widget.nms.service;

import com.dash.common.QueryConditions;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.nms.persistence.WidgetNmsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("widgetNmsService")
@Transactional
public class WidgetNmsServiceImpl implements WidgetNmsService {

    @Resource(name = "widgetNmsMapper")
    private WidgetNmsMapper mapper;

    @Override
    public ReturnData getHighPerfByDev(Criterion criterion) {
        return new ReturnData(mapper.selectHighPerfByDev(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighTrafficByDev(Criterion criterion) {
        return new ReturnData(mapper.selectHighTrafficByDev(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighTrafficByIfGrp(Criterion criterion) {
        return new ReturnData(mapper.selectHighTrafficByIfGrp(criterion.getCondition()));
    }

    @Override
    public ReturnData getDevPerfChart(Criterion criterion) {
        ReturnData returnData = new ReturnData();
        if(criterion.getValue("itemType") != null &&  criterion.getValue("itemType").equals("6")){
            returnData.setResultData(mapper.selectDevRespPerfChart(criterion.getCondition()));
        }else{
            returnData.setResultData(mapper.selectDevPerfChart(criterion.getCondition()));
        }
        return returnData;
    }

    @Override
    public ReturnData getIfPerfChart(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectIfPerfChart(criterion.getCondition()));
    }

    @Override
    public ReturnData getDevList(Criterion criterion) {
        return new ReturnData(mapper.selectDevList(criterion.getCondition()));
    }

    @Override
    public ReturnData getIfList(Criterion criterion) {
        return new ReturnData(mapper.selectIfList(criterion.getCondition()));
    }

    @Override
    public ReturnData getGrpDevList(Criterion criterion) {
        return new ReturnData(mapper.selectGrpDevList(criterion.getCondition()));
    }
}
