package com.dash.widget.nms.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "widgetNmsMapper")
public interface WidgetNmsMapper {

    List<CamelHashMap> selectHighPerfByDev(Map<String, Object> criterion);

    List<CamelHashMap> selectHighTrafficByDev(Map<String, Object> criterion);

    List<CamelHashMap> selectHighTrafficByIfGrp(Map<String, Object> criterion);

    List<CamelHashMap> selectDevPerfChart(Map<String, Object> condition);
    List<CamelHashMap> selectDevRespPerfChart(Map<String, Object> condition);

    List<CamelHashMap> selectIfPerfChart(Map<String, Object> condition);

    List<CamelHashMap> selectDevList(Map<String, Object> condition);

    List<CamelHashMap> selectIfList(Map<String, Object> condition);

    List<CamelHashMap> selectGrpDevList(Map<String, Object> condition);
}
