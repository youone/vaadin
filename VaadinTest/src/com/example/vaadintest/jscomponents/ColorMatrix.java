package com.example.vaadintest.jscomponents;

import java.util.ArrayList;
import java.util.HashMap;

import com.example.vaadintest.tools.ImageBuilder;
import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;

@StyleSheet({
	"vaadin://css/colorMatrix.css", 
})
@JavaScript({
	"vaadin://js/colorMatrix.js", 
	"https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js",
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
	"https://d3js.org/d3.v3.min.js"
})
public class ColorMatrix extends AbstractJavaScriptComponent {

	ImageBuilder imageBuilder = new ImageBuilder();
	public AllData allData = new AllData();

	public ColorMatrix() {		
	}

	public class AllData {
		public HashMap<String, String> matrixPngData = new HashMap<String, String>();
		public HashMap<String, ArrayList<ArrayList<ArrayList<Float>>>> mapData = new HashMap<String, ArrayList<ArrayList<ArrayList<Float>>>>();
	}
		
	public void addMatrixData(ArrayList<HashMap<String, Float[][]>> colorMatrixData) {
		HashMap<String, String> matrixPngData = new HashMap<String, String>();
		matrixPngData.put("title1", imageBuilder.buildImage(colorMatrixData.get(0)));
		matrixPngData.put("title2", imageBuilder.buildImage(colorMatrixData.get(1)));
		matrixPngData.put("title3", imageBuilder.buildImage(colorMatrixData.get(2)));
		allData.matrixPngData = matrixPngData;
	}

	public void updateState() {
		getState().allData = allData;
	}

	 @Override
	 protected ColorMatrixState getState() {
		 return (ColorMatrixState) super.getState();
	 }

}
