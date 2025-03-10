package com.dash.main.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ErrorInfo;
import com.dash.common.model.ReturnData;
import com.dash.main.service.MainService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MainController {

    @Resource(name="mainService")
    private MainService service;

    /**
     * 주기조회
     */
    @GetMapping("getRefreshTime")
    public ReturnData getRefreshTime() {
        return service.getRefreshTime();
    }

    /**
     * 주기설정
     */
    @PostMapping("chgRefreshTime")
    public void chgRefreshTime(@RequestBody Map<String, Object> reqMap) {
        service.chgRefreshTime(new Criterion(reqMap));
    }

    /**
     * 패널 타이틀 설정
     */
    @PostMapping("editPanelTitle")
    public ReturnData editPanelTitle(@RequestBody Map<String, Object> reqMap) {
        return service.editPanelTitle(new Criterion(reqMap));
    }

    @GetMapping("getWidgetResizeList")
    public ReturnData getWidgetResizeList(@RequestParam Map<String, Object> reqMap) {
        return service.getWidgetResizeList(new Criterion(reqMap));
    }

    @PostMapping("addWidgetResizeList")
    public ReturnData addWidgetResizeList(@RequestBody Map<String, Object> reqMap) {
        return service.addWidgetResizeList(new Criterion(reqMap));
    }

    @RequestMapping(value = "upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public void fileUpload(@RequestPart("fileToUpload") MultipartFile multipartFile, @RequestParam("uploadType") String uploadType,
                           HttpServletRequest request, HttpServletResponse response) throws IOException {
        String tempFileName = "dashBG.jpg";
        if(uploadType.equals("logo")){
            tempFileName = "logo.png";
        }

        String originalFileName = multipartFile.getOriginalFilename();

        //확장자 제약시 사용
        //String contenType = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();

        service.fileUploadLocal(multipartFile, tempFileName);

        //첨부파일 여러개 등록 및 관리 할 경우
        /*Criterion criterion = new Criterion();
        criterion.addParam("fileName", tempFileName);
        criterion.addParam("originalFileName", originalFileName);
        criterion.addParam("fileType", originalFileName.substring(originalFileName.lastIndexOf(".") + 1));
        criterion.addParam("fileSize", multipartFile.getSize());
        ReturnData returnData = service.insertFileInfo(criterion);*/

        try {
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.valueOf("ok"));
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    @RequestMapping(value = "uploadLocal", produces = MediaType.APPLICATION_JSON_VALUE)
    public void fileUploadDevelopment(@RequestPart("fileToUpload") MultipartFile multipartFile, @RequestParam("uploadType") String uploadType,
                                      HttpServletRequest request, HttpServletResponse response) throws IOException {
        String tempFileName = "dashBG.jpg";

        if(uploadType.equals("logo")){
            tempFileName = "logo.png";
        }

        service.fileUploadLocalDevelopment(multipartFile, tempFileName, request);

        try {
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.valueOf("ok"));
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    @PostMapping("chgDashConf")
    public void chgDashConf(@RequestBody Map<String, Object> reqMap) {
        service.chgDashConf(new Criterion(reqMap));
    }

    @GetMapping("getDashConf")
    public ReturnData getDashConf() {
        return service.getDashConf();
    }

    @GetMapping("getTemplateList")
    public ReturnData getTemplateList() {
        return service.getTemplateList();
    }

    @PostMapping("applyTemplate")
    public ReturnData applyTemplate(@RequestBody Map<String, Object> reqMap) {
        return service.applyTemplate(new Criterion(reqMap));
    }

    @PostMapping("addTemplate")
    public ReturnData addTemplate(@RequestBody Map<String, Object> reqMap) {
        return service.addTemplate(new Criterion(reqMap));
    }

    @PostMapping("delTemplate")
    public ReturnData delTemplate(@RequestBody Map<String, Object> reqMap) {
        return service.delTemplate(new Criterion(reqMap));
    }

    @PostMapping("editWidgetItemConf")
    public ReturnData editWidgetItemConf(@RequestBody Map<String, Object> reqMap) {
        return service.editWidgetItemConf(new Criterion(reqMap));
    }

    @GetMapping("getUploadImagePath")
    public ReturnData test() {
        return service.test();
    }

    @GetMapping("getEvtConf")
    public ReturnData getEvtConf() {
        return service.getEvtConf();
    }

    @GetMapping("getCodeList")
    public ReturnData getCodeList() {
        return service.getCodeList();
    }
}
