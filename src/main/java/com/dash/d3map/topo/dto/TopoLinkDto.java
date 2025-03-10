package com.dash.d3map.topo.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class TopoLinkDto implements Serializable {
	private long linkNo;
	private long mngNo1;
	private long mngNo2;
	private long ifIdx1;
	private long ifIdx2;
	private long itemNo1;
	private long itemNo2;
	private int evtLevel1;
	private int evtLevel2;
	private long lineWidth1;
	private long lineWidth2;
	private String linkName1;
	private String linkName2;
	private int linkIdx1;
	private int linkIdx2;
	private String trafficType1;
	private String trafficType2;
	private long traffic1;
	private long traffic2;
	private long traffic1In;
	private long traffic1Out;
	private long traffic2In;
	private long traffic2Out;
	private long point1;
	private long point2;
	private long point3;
	private int linePointUD1;
	private int linePointUD2;
	private int linePointLR1;
	private int linePointLR2;
	private int isMain;
	private int isMulti;
	private int lineSize;
	private int lineType;
	private int shEvt;
	private int gcNo;
	private int linkCnt;
	private float curveX1;
	private float curveY1;
	private float curveX2;
	private float curveY2;
	private String lineStyle;
	private String lineColor;
	private String pollingColor;
	private String userPollLineColor1;
	private String userPollLineColor2;
	private String lineTrafficEffect;
	private int lineTrafficEffectSpeed;
	private String lineFlowEffect;
	private int lineFlowEffectSpeed;
	private int lineFlowEffectCount;
	private String lineFlowEffectColor;
	private String lineLabelConf;
}
