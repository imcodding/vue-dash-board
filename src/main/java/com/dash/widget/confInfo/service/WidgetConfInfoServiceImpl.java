package com.dash.widget.confInfo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.confInfo.persistence.WidgetConfInfoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("widgetConfInfoService")
@Transactional
public class WidgetConfInfoServiceImpl implements WidgetConfInfoService {

    @Resource(name = "widgetConfInfoMapper")
    private WidgetConfInfoMapper mapper;

    @Override
    public ReturnData getConfInfoItem(Criterion criterion) {
        String devKind2 = String.valueOf(criterion.getValue("devKind2"));
        criterion.addParam("devKind2List", devKind2.split(","));
        return new ReturnData(mapper.selectConfInfoItem(criterion.getCondition()));
    }

    @Override
    public ReturnData getDevKindList(Criterion criterion) {
        return new ReturnData(mapper.selectDevKindList(criterion.getCondition()));
    }
}
