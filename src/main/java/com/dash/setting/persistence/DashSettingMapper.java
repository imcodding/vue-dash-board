package com.dash.setting.persistence;

import com.dash.common.model.CamelHashMap;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository(value = "dashSettingMapper")
public interface DashSettingMapper {
    List<CamelHashMap> selectImgList(Map<String, Object> condition);

    CamelHashMap selectImgInfo(Map<String, Object> condition);

    void insertImg(Map<String, Object> condition);

    int deleteImg(Map<String, Object> condition);

    int insertTab(Map<String, Object> condition);

    List<CamelHashMap> selectTabList(Map<String, Object> condition);

    int insertRemakeWidget(Map<String, Object> condition);

    int updateTabRotation(Map<String, Object> condition);

    int updateConf(Map<String, Object> condition);
}
