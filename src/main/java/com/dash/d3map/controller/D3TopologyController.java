package com.dash.d3map.controller;

import com.dash.common.finder.D3TopologyServiceFinder;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/d3map/")
public class D3TopologyController {

    private final D3TopologyServiceFinder service;

    public D3TopologyController(D3TopologyServiceFinder service) {
        this.service = service;
    }

    /**
     * 환경설정 조회
     */
    @GetMapping("getTopoEnvSetting")
    public ReturnData getTopoEnvSetting(@RequestParam Map<String, Object> reqMap) {
        return service.find().getTopoEnvSetting(new Criterion(reqMap));
    }

    /**
     * 토폴로지 아이템 조회
     */
    @PostMapping("getTopoItemList")
    public ReturnData getTopoItemList(@RequestBody Map<String, Object> reqMap) {
        return service.find().getTopoItemList(new Criterion(reqMap));
    }

    /**
     * 토폴로지 링크 조회
     */
    @PostMapping("getTopoLinkList")
    public ReturnData getTopoLinkList(@RequestBody Map<String, Object> reqMap) {
        return service.find().getTopoLinkList(new Criterion(reqMap));
    }

    /**
     * 배경 이미지 조회
     */
    @GetMapping("getTopoGrpInfo")
    public ReturnData getTopoGrpInfo(@RequestParam Map<String, Object> reqMap) {
        return service.find().getTopoGrpInfo(new Criterion(reqMap));
    }

    /**
     * 최상위 그룹번호 조회
     */
    @GetMapping("getMapTopGrpInfo")
    public ReturnData getMapTopGrpInfo(@RequestParam Map<String, Object> reqMap) {
        return service.find().getMapTopGrpInfo(new Criterion(reqMap));
    }

    /**
     * 상위 그룹 번호 조회
     */
    @GetMapping("getParentGrpNo")
    public ReturnData getParentGrpNo(@RequestParam Map<String, Object> reqMap) {
        return service.find().getParentGrpNo(new Criterion(reqMap));
    }

    /**
     * 도형 그리기 (직선, 원 등)
     */
    @PostMapping("getSplineToolList")
    public ReturnData getSplineToolList(@RequestBody Map<String, Object> reqMap) {
        return service.find().getSplineToolList(new Criterion(reqMap));
    }

    /**
     * 그리기 관련 조회 (텍스트 상자 등)
     */
    @PostMapping("getDrawToolList")
    public ReturnData getDrawToolList(@RequestBody Map<String, Object> reqMap) {
        return service.find().getDrawToolList(new Criterion(reqMap));
    }

}
