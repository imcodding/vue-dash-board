package com.dash.common.cfg.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface CfgService {
    ReturnData getGrid(Criterion criterion);

    ReturnData saveGrid(Criterion criterion);
}
