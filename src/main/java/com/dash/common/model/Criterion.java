package com.dash.common.model;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Criterion {
    private Map<String, Object> condition = new HashMap<String, Object>();

    public Criterion(){

    }
    public Criterion(Map<String, Object> reqMap){
        this();
        Iterator<String> keys = reqMap.keySet().iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = reqMap.get(key);
            this.addParam(key, value);
        }
    }

    /**
     * 파라미터 추가
     * @param key
     * @param value
     */
    public void addParam(String key, Object value) {
        this.condition.put(key, value);
    }

    /**
     * key를 인자로 받아 value 리턴
     * @param key
     * @return
     */
    public Object getValue(String key) {
        if (containsKey(key)) {
            return condition.get(key);
        }
        return null;
    }

    /**
     * key가 존재하면 true, 그렇지 않으면 false 리턴
     * @param key
     * @return
     */
    public boolean containsKey(String key) {
        return condition.containsKey(key);
    }

    /**
     * @return the condition
     */
    public Map<String, Object> getCondition() {
        return condition;
    }
}
