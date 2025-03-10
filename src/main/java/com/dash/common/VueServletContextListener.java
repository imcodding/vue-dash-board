package com.dash.common;

import com.dash.common.model.Criterion;
import com.dash.main.service.MainService;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* vue Listener
* 기초 데이터 위젯 설정(로고, 타이틀, 시간)
 * 추후 code 관련 테이블 데이터 cache 사용 로컬화 진행 예정
* */
public class VueServletContextListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext sc = sce.getServletContext();
        WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(sc);
        MainService mainService = (MainService)ctx.getBean("mainService");

        //기초 데이터 목록
        List<String> setData = new ArrayList<String>();
        setData.add("TAB");
        setData.add("TITLE");
        setData.add("LOGO");
        setData.add("TIMESET");

        Criterion params = new Criterion();
        params.addParam("tabSeq", 1);
        //현재 DB에 등록되어 있는 기초 데이터 확인
        Object resultData = mainService.getBasicWidget(params).getResultData();
        List<Map<String, Object>> list = (List<Map<String, Object>>) resultData;
        for(Map<String, Object> curData : list){
            //존재 하는 기초 데이터 목록 제외
            //전부 없는 경우(초기 포팅) setData 그대로 유지
            setData.remove(curData.get("type").toString());
        }

        List<Map<String, Object>> mapList = new ArrayList<>();

        //기초 데이터 종류(타이틀,로고,시간) 별 condition 값 설정
        for(String type : setData) {
            Map<String, Object> item = new HashMap<>();
            item.put("type", type);

            switch (type) {
                case "TAB":
                    item.put("x", 100);
                    item.put("y", 100);
                    item.put("width", 200);
                    item.put("height", 50);
                    break;
                case "TITLE":
                    item.put("x", 680);
                    item.put("y", 5);
                    item.put("width", 580);
                    item.put("height", 55);
                    item.put("name", "대시보드");
                    break;
                case "LOGO":
                    item.put("x", 0);
                    item.put("y", 5);
                    item.put("width", 340);
                    item.put("height", 80);
                    break;
                case "TIMESET":
                    item.put("x", 1410);
                    item.put("y", 0);
                    item.put("width", 505);
                    item.put("height", 90);
                    break;

            }

            mapList.add(item);
        }

        //설정할 기초데이터가 없는 경우 패스
        if(mapList.size() > 0){
            Criterion criterion = new Criterion();
            criterion.addParam("setDataList", mapList);
            criterion.addParam("tabSeq", 1);
            mainService.addBasicWidget(criterion);
        }
        //System.out.println("Initialized Context");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        //no action
        //System.out.println("Destroyed Context");
    }
}
