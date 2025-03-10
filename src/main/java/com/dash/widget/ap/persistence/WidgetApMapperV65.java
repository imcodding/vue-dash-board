package com.dash.widget.ap.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "widgetApMapperV65")
public interface WidgetApMapperV65 {

    List<CamelHashMap> selectEvtTimeTopByAp(Map<String, Object> condition);
    List<CamelHashMap> selectClientAnalysis(Map<String, Object> condition);
    List<CamelHashMap> selectMaxCCUByTime(Map<String, Object> condition);
    List<CamelHashMap> selectTrafficAnalysis(Map<String, Object> condition);
    List<CamelHashMap> selectMaxTrafficByTime(Map<String, Object> condition);
    List<CamelHashMap> selectHighTrafficByClient(Map<String, Object> condition);
    List<CamelHashMap> selectHighTrafficByAp(Map<String, Object> condition);
    List<CamelHashMap> selectLowTrafficByAp(Map<String, Object> condition);
    List<CamelHashMap> selectHighClientByAp(Map<String, Object> condition);
    List<CamelHashMap> selectLowClientByAp(Map<String, Object> condition);
    List<CamelHashMap> selectClientStateByOs(Map<String, Object> condition);
    List<CamelHashMap> selectTrafficStateByOs(Map<String, Object> condition);
    CamelHashMap selectApStatus(Map<String, Object> condition);
}
