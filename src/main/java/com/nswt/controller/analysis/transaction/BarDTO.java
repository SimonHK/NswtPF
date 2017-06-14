package com.nswt.controller.analysis.transaction;

import java.util.List;

/**
 * Created by hongkai on 2017/6/2.
 */
public class BarDTO <T>{

    private String name;
    private String type;
    private List<T> data;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public List<T> getData() {
        return data;
    }
    public void setData(List<T> data) {
        this.data = data;
    }

}