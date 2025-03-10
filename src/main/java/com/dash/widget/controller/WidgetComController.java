package com.dash.widget.controller;

import com.dash.common.finder.WidgetComServiceFinder;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/com")
public class WidgetComController {

    private final WidgetComServiceFinder service;

    public WidgetComController(WidgetComServiceFinder service) {
        this.service = service;
    }

    @GetMapping(value = "getEvtStatus")
    public ReturnData getEvtStatus(@RequestParam Map<String, Object> reqMap) {
        return service.find().getEvtStatus(new Criterion(reqMap));
    }

    /**
     * 토폴로지 그룹
     */
    @GetMapping("getD3TopoGrpTreeList")
    public ReturnData getD3TopoGrpTreeList(@RequestParam Map<String, Object> reqMap) {
        return service.find().getD3TopoGrpTreeList(new Criterion(reqMap));
    }

    /**
     * 그룹(트리용)
     */
    @GetMapping("getGrpTreeList")
    public ReturnData getGrpTreeList(@RequestParam Map<String, Object> reqMap) {
        return service.find().getGrpTreeList(new Criterion(reqMap));
    }
}
