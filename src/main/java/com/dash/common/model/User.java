package com.dash.common.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class User {
    private String uuid;
    private String userId;
    private String password;
    private String userName;
    private String deptName;
    private String posName;
    private String empId;
    private String email;
    private String officeTel;
    private String cellTel;
    private String auth;
    private int useFlag;
    private long devGrpNo;
    private long authGrpNo;
    private String parentId;
    private int isshare;
    private int isRecvEmail;
    private int isRecvSms;
    private int minorPoll;
    private int majorPoll;
    private int criticalPoll;
    private String userPcIp;
    private String loginDateTime;
    private int passErrCnt;
    private String isLockClear;
    private Date passDate;
    private Date passChgDate;
    private int topoAuthGrpNo;
    private int menuAuthNo;
    private int isResetPw;
    private String loginExpired = "N";


    private String isAdminYN;

    // 로그인이력
    private String sessionId;
    private String loginIp;
}
