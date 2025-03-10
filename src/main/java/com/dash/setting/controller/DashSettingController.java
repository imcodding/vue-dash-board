package com.dash.setting.controller;

import com.dash.common.model.Criterion;
import com.dash.common.model.ErrorInfo;
import com.dash.common.model.ReturnData;
import com.dash.setting.service.DashSettingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/dash/setting")
public class DashSettingController {

    @Resource(name = "dashSettingService")
    private DashSettingService service;

    /**
     * 배경 및 로고 이미지 조회
     */
    @GetMapping(value = "imgList")
    public ReturnData getImgList(@RequestParam Map<String, Object> reqMap) {
        return service.getImgList(new Criterion(reqMap));
    }

    /**
     * 배경 및 로고 이미지 추가
     */
    @PostMapping(value = "uploadImg", produces = MediaType.APPLICATION_JSON_VALUE)
    public ReturnData addImg(
            @RequestParam("fileInput") MultipartFile multipartFile,
            @RequestParam("fileType") String fileType,
            @RequestParam("imgName") String imgName,
            @RequestParam("mode") String mode
    ) {
        try {
            byte[] imgBytes = multipartFile.getBytes();

            //2024.05 TEST 진행 중 (DB 데이터 저장 로직X)
            //이미지 업로드시 실제 unique 파일명으로 생성에서 입력한 실제 텍스트로 파일 생성

            //String imgUid = String.format("UID_%s_%s", imgName, UUID.randomUUID().toString());

            Criterion criterion = new Criterion();
            //criterion.addParam("imgUid", imgUid);
            criterion.addParam("img", imgBytes);
            criterion.addParam("imgName", imgName);
            criterion.addParam("imgKind2", fileType);
            criterion.addParam("mode", mode);

            return service.addImg(criterion);
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e.getMessage()));
        }
    }

    /**
     * 배경 및 로고 이미지 삭제
     */
    @PostMapping(value="delImg")
    public ReturnData delImg(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.delImg(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 배경 및 로고 이미지 중복 검사
     */

    @PostMapping(value="fileCheck")
    public ReturnData fileCheck(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.fileCheck(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }

    /**
     * 배경 저장
     */
    @PostMapping(value="saveDashBg")
    public ReturnData saveDashBg(@RequestBody Map<String, Object> reqMap) {
        try {
            return service.saveDashBg(new Criterion(reqMap));
        } catch (Exception e) {
            e.printStackTrace();
            return new ReturnData(new ErrorInfo(e));
        }
    }
    /**
     * 탭 설정 > 탭 추가
     * 탭추가 이후 탭에 설정된 위젯들 재구성
     */
    @PostMapping("addTab")
    public ReturnData addTab(@RequestBody Map<String, Object> reqMap) {
        return service.addTab(new Criterion(reqMap));
    }

    /**
     * 설정된 탭 목록 조회
     */
    @GetMapping(value = "getTabList")
    public ReturnData getTabList(@RequestParam Map<String, Object> reqMap) {
        return service.getTabList(new Criterion(reqMap));
    }
}
