package com.dash.widget.com.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "widgetComMapperV65")
public interface WidgetComMapperV65 {

    List<CamelHashMap> selectEvtCnt(Map<String, Object> condition);

    List<CamelHashMap> selectEvtStatusList(Map<String, Object> condition);

    List<CamelHashMap> selectD3TopoGrpTreeList(Map<String, Object> condition);

    List<CamelHashMap> selectGrpTreeList(Map<String, Object> condition);
}
