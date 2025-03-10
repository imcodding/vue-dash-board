package com.dash.widget.confInfo.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "widgetConfInfoMapper")
public interface WidgetConfInfoMapper {

    CamelHashMap selectConfInfoItem(Map<String, Object> condition);

    List<CamelHashMap> selectDevKindList(Map<String, Object> condition);
}
