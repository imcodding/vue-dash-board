package com.dash.d3map.topo.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class TopoItem implements Serializable {
    private long uniqId;
    private String itemName;
    private int xpoint;
    private int ypoint;
    private long itemNo;
    private long grpNo;
    private long mngNo;
    private String devKind1;
    private String devKind2;
    private String usrKind;
    private float itemSize;
    private String devIp;
    private String itemAlias;
    private int fontSize;
    private int evtLevel;
    private long engNo;
    private int evtType;
    private int childCnt;
    private String temp1;
    private String temp2;
    private String temp3;
    private String userContent;
    private String haStatus;
    private int showLabel;
    private String dynInfo;
    private String location;
    private int icmpPoll;
    private String devPerf;
    private String itemConf;
    private String imgKind3;
}
