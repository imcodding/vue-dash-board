package com.dash.widget.sms.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.sms.persistence.WidgetSmsMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("widgetSmsService")
@Transactional
public class WidgetSmsServiceImpl implements WidgetSmsService {

    @Resource(name = "widgetSmsMapper")
    private WidgetSmsMapper mapper;

    @Override
    public ReturnData getHighCpuBySvr(Criterion criterion) {
        return new ReturnData(mapper.selectHighCpuBySvr(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighMemoryBySvr(Criterion criterion) {
        return new ReturnData(mapper.selectHighMemoryBySvr(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighFilesystemBySvr(Criterion criterion) {
        return new ReturnData(mapper.selectHighFilesystemBySvr(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighTrafficBySvr(Criterion criterion) {
        return new ReturnData(mapper.selectHighTrafficBySvr(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighCpuByProcess(Criterion criterion) {
        return new ReturnData(mapper.selectHighResourceByProcess(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighMemoryByProcess(Criterion criterion) {
        return new ReturnData(mapper.selectHighResourceByProcess(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighCpuByMonitoringProcess(Criterion criterion) {
        return new ReturnData(mapper.selectHighResourceByMonitoringProcess(criterion.getCondition()));
    }

    @Override
    public ReturnData getHighMemoryByMonitoringProcess(Criterion criterion) {
        return new ReturnData(mapper.selectHighResourceByMonitoringProcess(criterion.getCondition()));
    }

    @Override
    public ReturnData getConnectionStatusVmSvr(Criterion criterion) {
        return null;
    }
}
