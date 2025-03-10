package com.dash.common;

import com.dash.common.model.Criterion;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class QueryConditions {

	public static final String TODAY = "today";

	/**
	 * tableCnt 설정
	 * @param criterion
	 */
	public static void setTableCnt(Criterion criterion) {
		Date d = new Date();
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat format_time = new SimpleDateFormat("HHmm");
		String tmpDt = format.format(d);
		String tmpTi = format_time.format(d);

		Calendar cal = Calendar.getInstance();
		cal.setTime(d);

		String strDate = "";
		String strTime = "";

		if(criterion.containsKey("perfDataTime")) {
			int time = Integer.parseInt(String.valueOf(criterion.getValue("perfDataTime"))) * -1;
			cal.add(Calendar.HOUR, time); // 하루를 뺀다.
			strDate = format.format(cal.getTime());
			strTime = format_time.format(cal.getTime());
			criterion.addParam("date1", strDate);
			criterion.addParam("time1", strTime);
		} else {
			cal.add(Calendar.DAY_OF_YEAR, -1); // 하루를 뺀다.
			strDate = format.format(cal.getTime());
			criterion.addParam("date1", strDate);
			criterion.addParam("time1", tmpTi);
		}

		criterion.addParam("date2", tmpDt);
		criterion.addParam("time2", tmpTi); //시분 정보만 입력

		if (!criterion.containsKey("tableCnt")) {
			criterion.addParam("tableCnt", 2); // 조회 테이블
		} else {
			/* 쿼리에서 테이블_#{tableCnt} 가 적용되기 위해서 int 로 형변환 */
			String tableCnt = String.valueOf(criterion.getValue("tableCnt"));
			criterion.addParam("tableCnt", Integer.parseInt(tableCnt));
		}

		if (criterion.containsKey(TODAY)) { // 오늘 날짜만 조회
			criterion.addParam("date2", strDate);
			criterion.addParam("time1", "0000");
			criterion.addParam("time2", "2359");
		}

		if (criterion.containsKey("scondUse") && ((String) criterion.getValue("scondUse")).equals("1")) {
			String date1 = (String) criterion.getValue("date1"),
					time1 = (String) criterion.getValue("time1"),
					date2 = (String) criterion.getValue("date2"),
					time2 = (String) criterion.getValue("time2");
			String tableCnt = getDevTableInterval(date1, time1, date2, time2);
			criterion.addParam("tableCnt", tableCnt);
		}
	}

	public static String getDevTableInterval (String date1, String time1, String date2, String time2){
		String tableCnt = "1";
		try {
			time1 += "00";
			time2 += "00";

			if (date1.length() < 8 || date2.length() < 8 || time1.length() < 6 || time2.length() < 6)
				throw new Exception("조회기간의 날짜 길이가 짧아서 Table Interval을 반환할 수 없습니다.");

			SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
			Date fromDate = format.parse(date1 + time1);
			Date toDate = format.parse(date2 + time2);

			Date diffDate = new Date(toDate.getTime() - fromDate.getTime());
			double totalDays = diffDate.getTime() / 1000 / 60 / 60 / 24;

			if ((int) totalDays == 7) {
				tableCnt = "2";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return tableCnt;
	}

}
