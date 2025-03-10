package com.dash.setting.service;

import com.dash.common.model.CamelHashMap;
import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.conf.persistence.DashConfMapper;
import com.dash.main.persistence.MainMapper;
import com.dash.setting.persistence.DashSettingMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("dashSettingService")
@Transactional
public class DashSettingServiceImpl implements DashSettingService {

    @Resource(name = "dashSettingMapper")
    private DashSettingMapper mapper;
    @Resource(name = "dashConfMapper")
    private DashConfMapper dashConfMapper;
    @Resource(name = "mainMapper")
    private MainMapper mainMapper;

    @Override
    public ReturnData getImgList(Criterion criterion) {
        String imgKind2 = String.valueOf(criterion.getValue("imgKind2"));
        String uploadMode = String.valueOf(criterion.getValue("mode"));

        String folder = imgKind2.equals("BG") ? "bg" : "logo";
        String filePath = getImgPath(uploadMode);
        String searchText = (String) criterion.getValue("searchText");

        File dir = new File(filePath + folder);

        File[] files = null;
        //files = dir.listFiles();

        if(!StringUtils.isBlank(searchText)) {
            files = dir.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.contains(searchText);
                }
            });
        }
        else {
            files = dir.listFiles();
        }

        List<Map<String, Object>> list = new ArrayList<>();

        for(File file : files) {
            Map<String, Object> map = new HashMap<>();
            map.put("filePath", file.getAbsolutePath());
            //imgUid 확장자 제거
            map.put("imgUid", file.getName().substring(0, file.getName().lastIndexOf('.')));
            map.put("imgName", file.getName());

            list.add(map);

        }
        //저장후 db에서 목록 조회 로직 제거
        //업로드 경로 읽어 arr 생성
        //return new ReturnData(mapper.selectImgList(criterion.getCondition()));
        return new ReturnData(list);
    }

    @Override
    public ReturnData addImg(Criterion criterion) {
        String imgKind2 = String.valueOf(criterion.getValue("imgKind2"));
        String uploadMode = String.valueOf(criterion.getValue("mode"));

        String folder = imgKind2.equals("BG") ? "bg" : "logo";
//        String imgExt = imgKind2.equals("BG") ? ".png" : ".PNG";
        String imgExt = ".png";

        //이미지 업로드시 실제 unique 파일명으로 생성에서 입력한 실제 텍스트로 파일 생성
        //String fileName = criterion.getValue("imgUid").toString() + imgExt;
        String fileName = criterion.getValue("imgName").toString() + imgExt;

        String filePath = getImgPath(uploadMode);

        Path folderPath = Paths.get(filePath + folder);
        if (!Files.exists(folderPath)) {
            try {
                Files.createDirectories(folderPath);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Path path = Paths.get(filePath + folder, fileName);
        OutputStream os = null;

        try {
            os = new BufferedOutputStream(Files.newOutputStream(path, StandardOpenOption.CREATE_NEW));
            os.write((byte[]) criterion.getValue("img"));
            os.flush();
            os.close();
        } catch (IOException e) {
            throw new RuntimeException("이미지 파일 업로드 중 에러가 발생하였습니다.");
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                }
            }
        }

        //업로드 결과 db 저장로직 제거
        //마지막에 저장된 이미지 파일 정보 담아 그리드 addrow
        //mapper.insertImg(criterion.getCondition());
        //imgUid 확장자 제거
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = new HashMap<>();
        map.put("imgUid", fileName.substring(0, fileName.lastIndexOf('.')));
        map.put("imgName", fileName);
        list.add(map);
        return new ReturnData(list);

    }

    @Override
    public ReturnData delImg(Criterion criterion) {
        // 파일 삭제
        String imgKind2 = criterion.getValue("imgKind2").toString();
        String uploadMode = String.valueOf(criterion.getValue("mode"));

        String folder = imgKind2.equals("BG") ? "bg" : "logo";
        String imgExt = ".png";

        String filePath = getImgPath(uploadMode);
        String delFlag = "FAIL";
        List<Map<String, Object>> imgList = (List<Map<String, Object>>) criterion.getValue("imgList");
        if (!CollectionUtils.isEmpty(imgList)) {
            for (Map<String, Object> imgMap : imgList) {
                String fileName = imgMap.get("imgUid").toString() + imgExt;
                Path path = Paths.get(filePath + String.format("%s/%s", folder, fileName));
                try {
                    File file = path.toFile();
                    if (file.exists() && file.isFile()) {
                        file.delete();
                        delFlag = "OK";
                    }
                } catch (UnsupportedOperationException e) {
                    e.printStackTrace();
                    throw new RuntimeException("이미지 파일 삭제 중 에러가 발생하였습니다.");
                }
            }
        }
        return new ReturnData(delFlag);
    }

    private String getImgPath(String mode) {
        String imgPath = "";
        if(mode.equals("PRO")) {
            String uploadPath = "/NetisAPP/web/webobject/image";
            imgPath = uploadPath + "/vue/";
        } else {
            String myDir = System.getProperty("user.dir");
            String uploadPath = myDir + "/view/static";
            imgPath = uploadPath + "/img/d3/";
        }
        return imgPath;
    }

    @Override
    public ReturnData fileCheck(Criterion criterion) {
        String imgKind2 = String.valueOf(criterion.getValue("imgKind2"));
        String uploadMode = String.valueOf(criterion.getValue("mode"));

        String folder = imgKind2.equals("BG") ? "bg" : "logo";
        String filePath = getImgPath(uploadMode);
        String checkText = (String) criterion.getValue("imgName");

        File dir = new File(filePath + folder);
        File[] files = null;
        int checkCnt = 0;

        files = dir.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.contains(checkText);
                }
            });
        checkCnt = files.length;
        return new ReturnData(checkCnt);
    }

    @Override
    public ReturnData saveDashBg(Criterion criterion) {
        return new ReturnData(dashConfMapper.insertUpdateConf(criterion.getCondition()));
    }

    @Override
    public ReturnData addTab(Criterion criterion) {

        Map<String, Object> condition = criterion.getCondition();

        //신규 tab 생성. (delete -> insert)
        mapper.insertTab(condition);

        //탭 사용여부, 로테이션
        dashConfMapper.insertUpdateConfList(condition);

        //탭 추가 시 TAB, TITLE, LOGO, TIMESET 자동생성
        List<CamelHashMap> tabs = mapper.selectTabList(condition);
        for(CamelHashMap tab : tabs) {

            String tabSeq = String.valueOf(tab.get("tabSeq"));
            condition.put("tabSeq", tabSeq);
            List<CamelHashMap> basicList = mainMapper.selectBasicWidget(condition);

            if(basicList.size() == 0) {
                condition.replace("tabSeq", 1); //tabSeq = 1 필수 값이기 때문
                condition.put("setDataList", mainMapper.selectBasicWidget(condition));

                condition.replace("tabSeq", tabSeq);
                mainMapper.insertBasicWidget(condition);
            }
        }

        return new ReturnData("OK");
    }

    @Override
    public ReturnData getTabList(Criterion criterion) {
        return new ReturnData(mapper.selectTabList(criterion.getCondition()));
    }

}
