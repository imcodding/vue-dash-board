package com.dash.conf.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ErrorInfo;
import com.dash.common.model.ReturnData;
import com.dash.conf.service.DashConfService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/dash/conf")
public class DashConfController {

    @Resource(name = "dashConfService")
    private DashConfService service;

    /**
     * 조회
     */
    @GetMapping(value="getConf")
    public ReturnData getConf(@RequestParam Map<String, Object> reqMap) {
        try {
            return service.getConf(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 목록 조회
     */
    @GetMapping(value="getConfList")
    public ReturnData getConfList(@RequestParam Map<String, Object> reqMap) {
        try {
            return service.getConfList(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 추가
     */
    @PostMapping(value="addConf")
    public ReturnData addConf(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.addConf(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 수정
     */
    @PostMapping(value="editConf")
    public ReturnData editConf(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.editConf(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 삭제
     */
    @PostMapping(value="delConf")
    public ReturnData delConf(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.delConf(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 추가+수정
     */
    @PostMapping(value="saveConf")
    public ReturnData saveConf(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.saveConf(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 추가+수정 반복
     */
    @PostMapping(value="saveConfList")
    public ReturnData saveConfList(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.saveConfList(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }
}
