package com.dash.main.persistence;

import com.dash.common.model.CamelHashMap;
import com.dash.common.model.Criterion;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "mainMapper")
public interface MainMapper {

    CamelHashMap selectRefreshTime();

    int updateRefreshTime(Map<String, Object> criterion);

    int updatePanelTitle(Map<String, Object> condition);

    List<CamelHashMap> selectWidgetResizeList(Map<String, Object> condition);

    int insertWidgetResizeList(Map<String, Object> condition);

    int updateMainTitle(Map<String, Object> criterion);

    List<CamelHashMap> selectDashConf();

    List<CamelHashMap> selectTemplateList();

    int insertApplyTemplate(Map<String, Object> condition);

    int syncCfgGrid(Map<String, Object> condition);

    int insertTemplate(Map<String, Object> condition);

    int deleteTemplate(Map<String, Object> condition);

    int deleteCaptureWidget();

    int updateWidgetItemConf(Map<String, Object> condition);

    List<CamelHashMap> selectBasicWidget(Map<String, Object> condition);

    int insertBasicWidget(Map<String, Object> condition);

    List<CamelHashMap> selectEvtConf();

    List<CamelHashMap> selectCodeList();
}
