package com.example.vaadintest;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.Sizeable;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Label;
import com.vaadin.ui.Notification;
import com.vaadin.ui.Slider;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;

import bildtest.SomeClass;

@SuppressWarnings("serial")
@Theme("reindeer")
public class VaadintestUI extends UI {

	@WebServlet(value = "/*", asyncSupported = true)
	@VaadinServletConfiguration(productionMode = false, ui = VaadintestUI.class)
	public static class Servlet extends VaadinServlet {
	}

	
	private HashMap<String, Float[][]> generateData() {
		int nPatchesWidth = 10;
		int nPatchesHeight = 5*195;

		HashMap<String, Float[][]> data = new  HashMap<String, Float[][]>();
		Float[][] vData = new Float[nPatchesWidth][nPatchesHeight];
		Float[][] pData = new Float[nPatchesWidth][nPatchesHeight];
		for (int iWidth = 0; iWidth < nPatchesWidth; iWidth++ ) {
			for (int iHeight = 0; iHeight < nPatchesHeight; iHeight++ ) {
				vData[iWidth][iHeight] = (float) Math.random()*60-30;
//				vData[iWidth][iHeight] = (float) Math.random()*360;
				pData[iWidth][iHeight] = (float) Math.random()*10000;
			}
		}
		data.put("p", pData);
		data.put("v", vData);
		return data;
	}

	
	private HashMap<String, ArrayList<ArrayList<ArrayList<Float>>>> generateCombinedData(ArrayList<HashMap<String, Float[][]>> colorMatrixData) {

		Float[][] data1 = colorMatrixData.get(0).get("v");
		Float[][] data2 = colorMatrixData.get(1).get("v");
		Float[][] data3 = colorMatrixData.get(2).get("v");
		Float[][] pdata1 = colorMatrixData.get(0).get("p");
		Float[][] pdata2 = colorMatrixData.get(1).get("p");
		Float[][] pdata3 = colorMatrixData.get(2).get("p");

		int nPatchesWidth = data1.length;
		int nPatchesHeight = data1[0].length;

		HashMap<String, ArrayList<ArrayList<ArrayList<Float>>>> combinedData = new HashMap<String, ArrayList<ArrayList<ArrayList<Float>>>>();

		ArrayList<ArrayList<ArrayList<Float>>> height12 = new ArrayList<ArrayList<ArrayList<Float>>>();
		ArrayList<ArrayList<ArrayList<Float>>> height13 = new ArrayList<ArrayList<ArrayList<Float>>>();
		ArrayList<ArrayList<ArrayList<Float>>> height23 = new ArrayList<ArrayList<ArrayList<Float>>>();
		for (int iHeight = 0; iHeight < nPatchesHeight; iHeight++ ) {
			
			ArrayList<ArrayList<Float>> width12 = new ArrayList<ArrayList<Float>>();
			ArrayList<ArrayList<Float>> width13 = new ArrayList<ArrayList<Float>>();
			ArrayList<ArrayList<Float>> width23 = new ArrayList<ArrayList<Float>>();
			for (int iWidth = 0; iWidth < nPatchesWidth; iWidth++ ) {

				ArrayList<Float> pair12 = new ArrayList<Float>();
				pair12.add(data1[iWidth][iHeight]);
				pair12.add(data2[iWidth][iHeight]);
				pair12.add((pdata1[iWidth][iHeight] + pdata1[iWidth][iHeight])/2);
				width12.add(pair12);
				
				ArrayList<Float> pair13 = new ArrayList<Float>();
				pair13.add(data1[iWidth][iHeight]);
				pair13.add(data3[iWidth][iHeight]);
				pair13.add((pdata1[iWidth][iHeight] + pdata3[iWidth][iHeight])/2);
				width13.add(pair13);

				ArrayList<Float> pair23 = new ArrayList<Float>();
				pair23.add(data2[iWidth][iHeight]);
				pair23.add(data3[iWidth][iHeight]);
				pair23.add((pdata2[iWidth][iHeight] + pdata3[iWidth][iHeight])/2);
				width23.add(pair23);
			}
			height12.add(width12);
			height13.add(width13);
			height23.add(width23);
		}
		
		combinedData.put("title1-title2", height12);
		combinedData.put("title1-title3", height13);
		combinedData.put("title2-title3", height23);

		return combinedData;
	}

	
//	private Object generateCombinedData(
//			HashMap<String, Float[][]> data1, 
//			HashMap<String, Float[][]> data2,
//			HashMap<String, Float[][]> data3) {
//		return null;
//	}

	@Override
	protected void init(VaadinRequest request) {
		final VerticalLayout vLayout = new VerticalLayout();
		final HorizontalLayout layout = new HorizontalLayout();
		layout.setMargin(true);
		vLayout.setMargin(true);
		setContent(vLayout);
		
		ColorMatrix colorMatrix = new ColorMatrix();
		colorMatrix.setWidth(500, Sizeable.Unit.PIXELS);
		colorMatrix.setHeight(450, Sizeable.Unit.PIXELS);

		JsComponent jsComponent = new JsComponent();
		jsComponent.setWidth(600, Sizeable.Unit.PIXELS);
		jsComponent.setHeight(450, Sizeable.Unit.PIXELS);

		Button button = new Button("Set Data");
		button.addClickListener(new Button.ClickListener() {
			public void buttonClick(ClickEvent event) {

				long time = System.currentTimeMillis();

				HashMap<String, Float[][]> data1 = generateData();
				HashMap<String, Float[][]> data2 = generateData();
				HashMap<String, Float[][]> data3 = generateData();

				ArrayList<HashMap<String, Float[][]>> colorMatrixData = new ArrayList<HashMap<String, Float[][]>>();
				colorMatrixData.add(data1);
				colorMatrixData.add(data2);
				colorMatrixData.add(data3);
				
				colorMatrix.addMatrixData(colorMatrixData);
				colorMatrix.allData.mapData = generateCombinedData(colorMatrixData);
				colorMatrix.updateState();

				System.out.println(System.currentTimeMillis() - time);
//				cData = generateCombinedData(colorMatrixData);
			}
		});
		
//		Slider slider = new Slider();
//		slider.setImmediate(true);
//		slider.setMin(0.0);
//		slider.setMax(100.0);
//		slider.setValue(50.0);
//		slider.setImmediate(true);
 
//		slider.addValueChangeListener(e -> Notification.show("Value changed:", String.valueOf(e.getProperty().getValue()), Type.TRAY_NOTIFICATION));
//		slider.addValueChangeListener(e -> System.out.println("Value changed: " + String.valueOf(e.getProperty().getValue())));
		
		vLayout.addComponent(button);
		vLayout.addComponent(layout);
		layout.addComponent(colorMatrix);
		layout.addComponent(jsComponent);
		
	}

}