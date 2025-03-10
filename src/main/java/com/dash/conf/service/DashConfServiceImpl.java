package com.dash.conf.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.conf.persistence.DashConfMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("dashConfService")
@Transactional
public class DashConfServiceImpl implements DashConfService {
    @Resource(name = "dashConfMapper")
    private DashConfMapper mapper;

    @Override
    public ReturnData getConf(Criterion criterion) {
        return new ReturnData(mapper.selectConf(criterion.getCondition()));
    }

    @Override
    public ReturnData getConfList(Criterion criterion) {
        return new ReturnData(mapper.selectConfList(criterion.getCondition()));
    }

    @Override
    public ReturnData addConf(Criterion criterion) {
        return new ReturnData(mapper.insertConf(criterion.getCondition()));
    }

    @Override
    public ReturnData editConf(Criterion criterion) {
        return new ReturnData(mapper.updateConf(criterion.getCondition()));
    }

    @Override
    public ReturnData delConf(Criterion criterion) {
        return new ReturnData(mapper.deleteConf(criterion.getCondition()));
    }

    @Override
    public ReturnData saveConf(Criterion criterion) {
        return new ReturnData(mapper.insertUpdateConf(criterion.getCondition()));
    }

    @Override
    public ReturnData saveConfList(Criterion criterion) {
        return new ReturnData(mapper.insertUpdateConfList(criterion.getCondition()));
    }
}
