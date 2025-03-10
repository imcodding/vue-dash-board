package com.dash.common.cfg.service;

import com.dash.common.cfg.persistence.CfgMapper;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service("cfgService")
@Transactional
public class CfgServiceImpl implements CfgService {

    @Resource(name = "cfgMapper")
    private CfgMapper mapper;

    @Override
    public ReturnData getGrid(Criterion criterion) {
        return new ReturnData(mapper.selectGrid(criterion.getCondition()));
    }

    @Override
    public ReturnData saveGrid(Criterion criterion) {
        mapper.updateGrid(criterion.getCondition());
        return new ReturnData();
    }
}
