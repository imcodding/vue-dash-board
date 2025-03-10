package com.dash.conf.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "dashConfMapper")
public interface DashConfMapper {
    CamelHashMap selectConf(Map<String, Object> condition);

    List<CamelHashMap> selectConfList(Map<String, Object> condition);

    int insertConf(Map<String, Object> condition);

    int updateConf(Map<String, Object> condition);

    int deleteConf(Map<String, Object> condition);

    int insertUpdateConf(Map<String, Object> condition);

    int insertUpdateConfList(Map<String, Object> condition);
}
