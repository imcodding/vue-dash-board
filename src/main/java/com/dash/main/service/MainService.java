package com.dash.main.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


public interface MainService {

    ReturnData getRefreshTime();

    ReturnData chgRefreshTime(Criterion criterion);

    ReturnData editPanelTitle(Criterion criterion);

    ReturnData getWidgetResizeList(Criterion criterion);

    ReturnData addWidgetResizeList(Criterion criterion);

    void fileUploadLocal(MultipartFile multipartFile, String tempFileName) throws IOException;

    void fileUploadLocalDevelopment(MultipartFile multipartFile, String tempFileName, HttpServletRequest request) throws IOException;

    ReturnData chgDashConf(Criterion criterion);

    ReturnData getDashConf();

    ReturnData getTemplateList();

    ReturnData applyTemplate(Criterion criterion);

    ReturnData addTemplate(Criterion criterion);

    ReturnData delTemplate(Criterion criterion);

    ReturnData editWidgetItemConf(Criterion criterion);

    ReturnData test();

    ReturnData getBasicWidget(Criterion criterion);

    ReturnData addBasicWidget(Criterion criterion);

    ReturnData getEvtConf();

    ReturnData getCodeList();
}
