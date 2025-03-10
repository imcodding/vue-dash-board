package com.dash.widget.sms.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "widgetSmsMapper")
public interface WidgetSmsMapper {

    List<CamelHashMap> selectHighCpuBySvr(Map<String, Object> condition);

    List<CamelHashMap> selectHighMemoryBySvr(Map<String, Object> condition);

    List<CamelHashMap> selectHighFilesystemBySvr(Map<String, Object> condition);

    List<CamelHashMap> selectHighTrafficBySvr(Map<String, Object> condition);

    List<CamelHashMap> selectHighResourceByProcess(Map<String, Object> condition);

    List<CamelHashMap> selectHighResourceByMonitoringProcess(Map<String, Object> condition);
}
