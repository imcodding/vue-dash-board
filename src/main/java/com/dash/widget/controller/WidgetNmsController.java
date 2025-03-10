package com.dash.widget.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.nms.service.WidgetNmsService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/nms")
public class WidgetNmsController {
    @Resource(name = "widgetNmsService")
    private WidgetNmsService service;

    /**
     * CPU / Memory / 온도 / 응답시간 / 세션 TopN
     */
    @GetMapping(value="getHighPerfByDev")
    public ReturnData getHighPerfByDev(@RequestParam Map<String, Object> reqMap) {
        return service.getHighPerfByDev(new Criterion(reqMap));
    }

    /**
     * Traffic TopN
     */
    @GetMapping(value="getHighTrafficByDev")
    public ReturnData getHighTrafficByDev(@RequestParam Map<String, Object> reqMap) {
        return service.getHighTrafficByDev(new Criterion(reqMap));
    }

    /**
     * 회선그룹 Traffic TopN
     */
    @GetMapping(value="getHighTrafficByIfGrp")
    public ReturnData getHighTrafficByIfGrp(@RequestParam Map<String, Object> reqMap) {
        return service.getHighTrafficByIfGrp(new Criterion(reqMap));
    }

    /**
     * 장비 성능 현황
     */
    @GetMapping(value="getDevPerfChart")
    public ReturnData getDevPerfChart(@RequestParam Map<String, Object> reqMap) {
        return service.getDevPerfChart(new Criterion(reqMap));
    }

    /**
     * 회선 성능 현황
     */
    @GetMapping(value="getIfPerfChart")
    public ReturnData getIfPerfChart(@RequestParam Map<String, Object> reqMap) {
        return service.getIfPerfChart(new Criterion(reqMap));
    }

    /**
     * 기본 장비 목록
     */
    @GetMapping(value = "getDevList")
    public ReturnData getDevList(@RequestParam Map<String, Object> reqMap) {
        return service.getDevList(new Criterion(reqMap));
    }

    /**
     * 기본 회선 목록
     */
    @GetMapping(value = "getIfList")
    public ReturnData getIfList(@RequestParam Map<String, Object> reqMap) {
        return service.getIfList(new Criterion(reqMap));
    }

    @GetMapping(value = "getGrpDevList")
    public ReturnData getGrpDevList(@RequestParam Map<String, Object> reqMap) {
        return service.getGrpDevList(new Criterion(reqMap));
    }
}
