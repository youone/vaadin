package com.example.vaadintest.jscomponents;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import org.json.simple.JSONObject;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;

import elemental.json.JsonArray;

@StyleSheet({
	"vaadin://css/scatter.css",
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css"
	})
@JavaScript({
	"vaadin://js/jsComponent.js", 
	"https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js",
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
	"http://openlayers.org/en/v3.14.2/build/ol.js"
	})
public class JsComponent extends AbstractJavaScriptComponent {

	public JsComponent() {
	    addFunction("onClick", new JavaScriptFunction() {
	        @Override
	        public void call(JsonArray arguments) {
	        	System.out.println("you clicked");
	        	System.out.println(arguments);
	        	change();
//	            getState().setValue(arguments.getString(0));
//	            for (ValueChangeListener listener: listeners)
//	                listener.valueChange();
	        }
	    });

	}
	
	public void change() {
		getState().theText = "hhhejsan";
		this.callFunction("aJsFunction", "arg1");
	}

	
	public class ScatterDataPoint {

		public Double lon = 0D;
		public Double lat = 0D;
		public Double size = 0D;
		
		ScatterDataPoint(Double lon, Double lat, Double size) {
			this.lon = lon;
			this.lat = lat;
			this.size = size;
		}
	}

	private ArrayList<ArrayList<ScatterDataPoint>> generateScatterMatrix(int nPointsX, int nPointsY) {

		ArrayList<ScatterDataPoint> scatterPointsY = new ArrayList<ScatterDataPoint>();
		ArrayList<ArrayList<ScatterDataPoint>>  scatterPointsXY = new ArrayList<ArrayList<ScatterDataPoint>>();

		Double offset = 10 * Math.random();
		for(int iPointX=0; iPointX<nPointsX; iPointX++){
			scatterPointsY.clear();
			for(int iPointY=0; iPointY<nPointsY; iPointY++){
				Double lon = 3 * Math.random() + 10 + offset;
				Double lat = 5 * Math.random() + 50 + offset;
				Double size = Math.random();
				scatterPointsY.add(new ScatterDataPoint(lon, lat, size));
			}
			scatterPointsXY.add(scatterPointsY);
		}
		return scatterPointsXY;
	}


	public void setScatterData() {
		 getState().scatterData = generateScatterMatrix(10,195*5);
	}

	 @Override
	 protected JsComponentState getState() {
		 return (JsComponentState) super.getState();
	 }



}
