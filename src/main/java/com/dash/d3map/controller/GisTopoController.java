package com.dash.d3map.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.d3map.topo.service.GisTopoService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/d3map/gisTopo")
public class GisTopoController {

    @Resource(name="gisTopoService")
    private GisTopoService gisTopoService;

    @PostMapping("getGroupInfo")
    public ReturnData getGroupInfo(@RequestBody Map<String, Object> reqMap) {
        return gisTopoService.getGroupInfo(new Criterion(reqMap));
    }

    @PostMapping("getGisItemList")
    public ReturnData getGisItemList(@RequestBody Map<String, Object> reqMap) {
        return gisTopoService.getGisItemList(new Criterion(reqMap));
    }

    @PostMapping("saveItemLatLnt")
    public ReturnData saveItemLatLnt(@RequestBody Map<String, Object> reqMap) {
        return gisTopoService.saveItemLatLnt(new Criterion(reqMap));
    }

    @PostMapping("saveGroupLatLnt")
    public ReturnData saveGroupLatLnt(@RequestBody Map<String, Object> reqMap) {
        return gisTopoService.saveGroupLatLnt(new Criterion(reqMap));
    }
}
