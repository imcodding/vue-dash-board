package com.dash.d3map.topo.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.common.type.Version;
import com.dash.d3map.topo.dto.TopoLinkDto;
import com.dash.d3map.topo.persistence.D3TopologyMapperV65;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.List;

@Service("d3TopologyServiceV65")
@Transactional
public class D3TopologyServiceImplV65 implements D3TopologyService {

    @Resource(name = "d3TopologyMapperV65")
    private D3TopologyMapperV65 mapper;

    @Override
    public String getVersion() {
        return Version.VER_65.getDesc();
    }

    @Override
    public ReturnData getTopoEnvSetting(Criterion criterion) {
        return new ReturnData(mapper.selectTopoEnvSetting(criterion.getCondition()));
    }

    @Override
    public ReturnData getTopoItemList(Criterion criterion) {
        return new ReturnData(mapper.selectTopoItemList(criterion.getCondition()));
    }

    @Override
    public ReturnData getTopoLinkList(Criterion criterion) {
        List<TopoLinkDto> linkList = mapper.selectTopoLinkList(criterion.getCondition());
        if(!CollectionUtils.isEmpty(linkList)) {
            for(TopoLinkDto linkDto : linkList) {
                calcLinkCnt(linkDto, linkList);
            }
        }
        return new ReturnData(linkList);
    }

    private void calcLinkCnt(TopoLinkDto linkDto, List<TopoLinkDto> linkList) {
        int linkCnt = 0;
        for (TopoLinkDto topoLinkDto : linkList) {
            if (linkDto.getItemNo1() == topoLinkDto.getItemNo1()
                    && linkDto.getItemNo2() == topoLinkDto.getItemNo2()
                    && topoLinkDto.getLinkCnt() > linkCnt) {
                linkCnt = topoLinkDto.getLinkCnt();
            }
        }
        linkDto.setLinkCnt(linkCnt+1);
    }

    @Override
    public ReturnData getTopoGrpInfo(Criterion criterion) {
        return new ReturnData(mapper.selectTopoGrpInfo(criterion.getCondition()));
    }

    @Override
    public ReturnData getMapTopGrpInfo(Criterion criterion) {
        return new ReturnData(mapper.selectMapTopGrpInfo(criterion.getCondition()));
    }

    @Override
    public ReturnData getSplineToolList(Criterion criterion) {
        return new ReturnData(mapper.selectSplineToolList(criterion.getCondition()));
    }

    @Override
    public ReturnData getParentGrpNo(Criterion criterion) {
        return new ReturnData(mapper.selectParentGrpNo(criterion.getCondition()));
    }

    @Override
    public ReturnData getDrawToolList(Criterion criterion) {
        return new ReturnData(mapper.selectDrawToolList(criterion.getCondition()));
    }
}
