package com.example.vaadintest;

import java.util.ArrayList;
import java.util.HashMap;

import com.example.vaadintest.JsComponent.ScatterDataPoint;
//import com.example.vaadintest.JsComponent.ScatterDataPoint;
//import com.example.vaadintest.JsComponent.ScatterDataPoint;
import com.vaadin.shared.ui.JavaScriptComponentState;

public class JsComponentState extends JavaScriptComponentState {

    public String theText="halloj";
    
    public String[] SomeProperty={"value1", "value2"};

//    public HashMap<String, ArrayList<Double>> scatterData = new HashMap<String, ArrayList<Double>>();
    public ArrayList<ArrayList<ScatterDataPoint>> scatterData;
//    public Double scatterData;
}
