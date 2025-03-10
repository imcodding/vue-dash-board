package com.dash.widget.sms.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;

public interface WidgetSmsService {
    ReturnData getHighCpuBySvr(Criterion criterion);

    ReturnData getHighMemoryBySvr(Criterion criterion);

    ReturnData getHighFilesystemBySvr(Criterion criterion);

    ReturnData getHighTrafficBySvr(Criterion criterion);

    ReturnData getHighCpuByProcess(Criterion criterion);

    ReturnData getHighMemoryByProcess(Criterion criterion);

    ReturnData getHighCpuByMonitoringProcess(Criterion criterion);

    ReturnData getHighMemoryByMonitoringProcess(Criterion criterion);

    ReturnData getConnectionStatusVmSvr(Criterion criterion);
}
