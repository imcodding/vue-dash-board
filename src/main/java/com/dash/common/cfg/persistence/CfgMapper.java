package com.dash.common.cfg.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "cfgMapper")
public interface CfgMapper {
    List<CamelHashMap> selectGrid(Map<String, Object> condition);

    void updateGrid(Map<String, Object> condition);
}
