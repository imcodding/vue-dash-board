package com.dash.d3map.topo.persistence;

import com.dash.common.model.CamelHashMap;
import com.dash.d3map.topo.dto.MapTopoGrpDto;
import com.dash.d3map.topo.dto.TopoLinkDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "d3TopologyMapper")
public interface D3TopologyMapper {
    CamelHashMap selectTopoEnvSetting(Map<String, Object> paramMap);

    List<CamelHashMap> selectTopoItemList(Map<String, Object> paramMap);
    List<TopoLinkDto> selectTopoLinkList(Map<String, Object> paramMap);
    MapTopoGrpDto selectTopoGrpInfo(Map<String, Object> paramMap);

    CamelHashMap selectMapTopGrpInfo(Map<String, Object> paramMap);

    long selectParentGrpNo(Map<String, Object> condition);

    List<CamelHashMap> selectSplineToolList(Map<String, Object> paramMap);

    List<CamelHashMap> selectDrawToolList(Map<String, Object> paramMap);
}
