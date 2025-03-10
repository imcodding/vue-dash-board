package com.dash.common.controller;

import com.dash.common.cfg.service.CfgService;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/cfg")
public class CfgController {

    @Resource(name = "cfgService")
    private CfgService service;

    /**
     * 컬럼관리 Grid 조회
     */
    @GetMapping(value="getGrid")
    public ReturnData getGrid(@RequestParam Map<String, Object> reqMap) {
        return service.getGrid(new Criterion(reqMap));
    }

    /**
     * 컬럼관리 getGrid 저장
     */
    @PostMapping("saveGrid")
    public ReturnData saveGrid(@RequestBody Map<String, Object> reqMap) {
        return service.saveGrid(new Criterion(reqMap));
    }
}
