package com.dash.d3map.topo.persistence;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository("gisTopoMapper")
public interface GisTopoMapper {

    Map<String, Object> selectGroupInfo(Map<String, Object> paramMap);
    List<Map<String, Object>> selectGisItemList(Map<String, Object> paramMap);
    void updateItemLatLnt(Map<String, Object> paramMap);
    void updateGroupLatLng(Map<String, Object> paramMap);
}
