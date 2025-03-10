package com.dash.widget.ap.service;

import com.dash.common.QueryConditions;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.common.type.Version;
import com.dash.widget.ap.persistence.WidgetApMapperV65;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("widgetApServiceV65")
@Transactional
public class WidgetApServiceImplV65 implements WidgetApService {

    @Resource(name = "widgetApMapperV65")
    private WidgetApMapperV65 mapper;

    @Override
    public String getVersion() { return Version.VER_65.getDesc(); }

    @Override
    public ReturnData getApStatus(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectApStatus(criterion.getCondition()));
    }
    @Override
    public ReturnData getEvtTimeTopByAp(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectEvtTimeTopByAp(criterion.getCondition()));
    }
    @Override
    public ReturnData getClientAnalysis(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectClientAnalysis(criterion.getCondition()));
    }
    @Override
    public ReturnData getMaxCCUByTime(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectMaxCCUByTime(criterion.getCondition()));
    }
    @Override
    public ReturnData getTrafficAnalysis(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectTrafficAnalysis(criterion.getCondition()));
    }
    @Override
    public ReturnData getMaxTrafficByTime(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectMaxTrafficByTime(criterion.getCondition()));
    }
    @Override
    public ReturnData getHighTrafficByClient(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectHighTrafficByClient(criterion.getCondition()));
    }
    @Override
    public ReturnData getHighTrafficByAp(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectHighTrafficByAp(criterion.getCondition()));
    }
    @Override
    public ReturnData getLowTrafficByAp(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectLowTrafficByAp(criterion.getCondition()));
    }
    @Override
    public ReturnData getHighClientByAp(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectHighClientByAp(criterion.getCondition()));
    }
    @Override
    public ReturnData getLowClientByAp(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectLowClientByAp(criterion.getCondition()));
    }
    @Override
    public ReturnData getClientStateByOs(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectClientStateByOs(criterion.getCondition()));
    }
    @Override
    public ReturnData getTrafficStateByOs(Criterion criterion) {
        QueryConditions.setTableCnt(criterion);
        return new ReturnData(mapper.selectTrafficStateByOs(criterion.getCondition()));
    }
}

