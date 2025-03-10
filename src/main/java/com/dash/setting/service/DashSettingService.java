package com.dash.setting.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface DashSettingService {
    ReturnData getImgList(Criterion criterion);

    ReturnData addImg(Criterion criterion);

    ReturnData delImg(Criterion criterion);

    ReturnData fileCheck(Criterion criterion);

    ReturnData saveDashBg(Criterion criterion);

    ReturnData addTab(Criterion criterion);

    ReturnData getTabList(Criterion criterion);
}
