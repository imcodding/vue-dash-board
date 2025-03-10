package com.dash.widget.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.widget.confInfo.service.WidgetConfInfoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/conf-info")
public class WidgetConfInfoController {

    @Resource(name = "widgetConfInfoService")
    private WidgetConfInfoService service;

    @GetMapping("/item")
    public ReturnData getConfInfoItem(@RequestParam Map<String, Object> reqMap) {
        return service.getConfInfoItem(new Criterion(reqMap));
    }

    @GetMapping("/devKind")
    public ReturnData getDevKindList(@RequestParam Map<String, Object> reqMap) {
        return service.getDevKindList(new Criterion(reqMap));
    }
}
