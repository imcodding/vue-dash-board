package com.dash.widget.confInfo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.bind.annotation.RestController;

public interface WidgetConfInfoService {

    ReturnData getConfInfoItem(Criterion criterion);

    ReturnData getDevKindList(Criterion criterion);
}
