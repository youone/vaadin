package com.example.vaadintest;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.Sizeable;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Label;
import com.vaadin.ui.Notification;
import com.vaadin.ui.Slider;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;

@SuppressWarnings("serial")
@Theme("reindeer")
public class VaadintestUI extends UI {

	@WebServlet(value = "/*", asyncSupported = true)
	@VaadinServletConfiguration(productionMode = false, ui = VaadintestUI.class)
	public static class Servlet extends VaadinServlet {
	}

	@Override
	protected void init(VaadinRequest request) {
		final VerticalLayout layout = new VerticalLayout();
		layout.setMargin(true);
		setContent(layout);

		ColorMatrix colorMatrix = new ColorMatrix();
		colorMatrix.setWidth(600, Sizeable.Unit.PIXELS);
		colorMatrix.setHeight(300, Sizeable.Unit.PIXELS);

		JsComponent jsComponent = new JsComponent();
		jsComponent.setWidth(1000, Sizeable.Unit.PIXELS);
		jsComponent.setHeight(700, Sizeable.Unit.PIXELS);

		Button button = new Button("Set Data");
		button.addClickListener(new Button.ClickListener() {
			public void buttonClick(ClickEvent event) {
				jsComponent.setScatterData();
			}
		});
		
		Slider slider = new Slider();
		slider.setImmediate(true);
		slider.setMin(0.0);
		slider.setMax(100.0);
		slider.setValue(50.0);
//		slider.setImmediate(true);
 
//		slider.addValueChangeListener(e -> Notification.show("Value changed:", String.valueOf(e.getProperty().getValue()), Type.TRAY_NOTIFICATION));
		slider.addValueChangeListener(e -> System.out.println("Value changed: " + String.valueOf(e.getProperty().getValue())));
		
		layout.addComponent(button);
		layout.addComponent(jsComponent);
		layout.addComponent(colorMatrix);
	}

}