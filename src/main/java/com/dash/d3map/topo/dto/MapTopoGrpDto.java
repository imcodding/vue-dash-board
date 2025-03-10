package com.dash.d3map.topo.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class MapTopoGrpDto implements Serializable {
	private long grpNo;
	private long grpParent;
	private String grpParentNm;
	private String grpName;
	private String bgFileNm;
	private String viewType;
}
