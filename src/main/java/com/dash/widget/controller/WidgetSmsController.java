package com.dash.widget.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.sms.service.WidgetSmsService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
public class WidgetSmsController {
    @Resource(name = "widgetSmsService")
    private WidgetSmsService service;

    /**
     * CPU TopN
     */
    @GetMapping(value="getHighCpuBySvr")
    public ReturnData getHighCpuBySvr(@RequestParam Map<String, Object> reqMap) {
        return service.getHighCpuBySvr(new Criterion(reqMap));
    }

    /**
     * Memory TopN
     */
    @GetMapping(value="getHighMemoryBySvr")
    public ReturnData getHighMemoryBySvr(@RequestParam Map<String, Object> reqMap) {
        return service.getHighMemoryBySvr(new Criterion(reqMap));
    }

    /**
     * 파일시스템 사용률 TopN
     */
    @GetMapping(value="getHighFilesystemBySvr")
    public ReturnData getHighFilesystemBySvr(@RequestParam Map<String, Object> reqMap) {
        return service.getHighFilesystemBySvr(new Criterion(reqMap));
    }

    /**
     * Traffic TopN
     */
    @GetMapping(value="getHighTrafficBySvr")
    public ReturnData getHighTrafficBySvr(@RequestParam Map<String, Object> reqMap) {
        return service.getHighTrafficBySvr(new Criterion(reqMap));
    }

    /**
     * 프로세스 CPU TopN
     */
    @GetMapping(value="getHighCpuByProcess")
    public ReturnData getHighCpuByProcess(@RequestParam Map<String, Object> reqMap) {
        return service.getHighCpuByProcess(new Criterion(reqMap));
    }

    /**
     * 프로세스 Memory TopN
     */
    @GetMapping(value="getHighMemoryByProcess")
    public ReturnData getHighMemoryByProcess(@RequestParam Map<String, Object> reqMap) {
        return service.getHighMemoryByProcess(new Criterion(reqMap));
    }

    /**
     * 감시프로세스 CPU TopN
     */
    @GetMapping(value="getHighCpuByMonitoringProcess")
    public ReturnData getHighCpuByMonitoringProcess(@RequestParam Map<String, Object> reqMap) {
        return service.getHighCpuByMonitoringProcess(new Criterion(reqMap));
    }

    /**
     * 감시프로세스 Memory TopN
     */
    @GetMapping(value="getHighMemoryByMonitoringProcess")
    public ReturnData getHighMemoryByMonitoringProcess(@RequestParam Map<String, Object> reqMap) {
        return service.getHighMemoryByMonitoringProcess(new Criterion(reqMap));
    }

    /**
     * VM 접속상태
     */
    @GetMapping(value="getConnectionStatusVmSvr")
    public ReturnData getConnectionStatusVmSvr(@RequestParam Map<String, Object> reqMap) {
        return service.getConnectionStatusVmSvr(new Criterion(reqMap));
    }

}
