package com.dash.widget.controller;

import com.dash.common.finder.WidgetApServiceFinder;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/ap")
public class WidgetApController {

    private final WidgetApServiceFinder service;

    public WidgetApController(WidgetApServiceFinder widgetApServiceFinder) {
        this.service = widgetApServiceFinder;
    }

    /**
     *  접속 수량(현재/총 AP 수/접속자수)
     */
    @GetMapping(value="getApStatus")
    public ReturnData getApStatus(@RequestParam Map<String, Object> reqMap) {
        return service.find().getApStatus(new Criterion(reqMap));
    }

    /**
     *  AP별 장애시간 TopN
     */
    @GetMapping(value="getEvtTimeTopByAp")
    public ReturnData getEvtTimeTopByAp(@RequestParam Map<String, Object> reqMap) {
        return service.find().getEvtTimeTopByAp(new Criterion(reqMap));
    }

    /**
     *  전체 클라이언트 추이
     */
    @GetMapping(value="getClientAnalysis")
    public ReturnData getClientAnalysis(@RequestParam Map<String, Object> reqMap) {
        return service.find().getClientAnalysis(new Criterion(reqMap));
    }

    /**
     *  시간대별 최대 동접자
     */
    @GetMapping(value="getMaxCCUByTime")
    public ReturnData getMaxCCUByTime(@RequestParam Map<String, Object> reqMap) {
        return service.find().getMaxCCUByTime(new Criterion(reqMap));
    }

    /**
     *  트래픽 사용량 추이
     */
    @GetMapping(value="getTrafficAnalysis")
    public ReturnData getTrafficAnalysis(@RequestParam Map<String, Object> reqMap) {
        return service.find().getTrafficAnalysis(new Criterion(reqMap));
    }

    /**
     *  시간대별 최대 트래픽
     */
    @GetMapping(value="getMaxTrafficByTime")
    public ReturnData getMaxTrafficByTime(@RequestParam Map<String, Object> reqMap) {
        return service.find().getMaxTrafficByTime(new Criterion(reqMap));
    }

    /**
     *  클라이언트별 트래픽 사용량 TopN
     */
    @GetMapping(value="getHighTrafficByClient")
    public ReturnData getHighTrafficByClient(@RequestParam Map<String, Object> reqMap) {
        return service.find().getHighTrafficByClient(new Criterion(reqMap));
    }

    /**
     *  AP별 트래픽 사용량 TopN
     */
    @GetMapping(value="getHighTrafficByAp")
    public ReturnData getHighTrafficByAp(@RequestParam Map<String, Object> reqMap) {
        return service.find().getHighTrafficByAp(new Criterion(reqMap));
    }

    /**
     *  AP별 트래픽 사용량 LowN
     */
    @GetMapping(value="getLowTrafficByAp")
    public ReturnData getLowTrafficByAp(@RequestParam Map<String, Object> reqMap) {
        return service.find().getLowTrafficByAp(new Criterion(reqMap));
    }

    /**
     *  AP별 클라이언트 TopN
     */
    @GetMapping(value="getHighClientByAp")
    public ReturnData getHighClientByAp(@RequestParam Map<String, Object> reqMap) {
        return service.find().getHighClientByAp(new Criterion(reqMap));
    }

    /**
     *  AP별 클라이언트 LowN
     */
    @GetMapping(value="getLowClientByAp")
    public ReturnData getLowClientByAp(@RequestParam Map<String, Object> reqMap) {
        return service.find().getLowClientByAp(new Criterion(reqMap));
    }

    /**
     *  OS별 클라이언트 접속 현황
     */
    @GetMapping(value="getClientStateByOs")
    public ReturnData getClientStateByOs(@RequestParam Map<String, Object> reqMap) {
        return service.find().getClientStateByOs(new Criterion(reqMap));
    }

    /**
     *  OS별 트래픽 사용 현황
     */
    @GetMapping(value="getTrafficStateByOs")
    public ReturnData getTrafficStateByOs(@RequestParam Map<String, Object> reqMap) {
        return service.find().getTrafficStateByOs(new Criterion(reqMap));
    }
}
