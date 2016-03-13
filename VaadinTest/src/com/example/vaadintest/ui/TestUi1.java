package com.example.vaadintest.ui;

import javax.servlet.annotation.WebServlet;

import com.example.vaadintest.jscomponents.OlMap;
import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;

@SuppressWarnings("serial")
@Theme("vaadintest")
@JavaScript({
	"https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js",
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"
	})
public class TestUi1 extends UI {

	@WebServlet(value = {"/test1/*", "/VAADIN1/*"}, asyncSupported = true)
	@VaadinServletConfiguration(productionMode = false, ui = TestUi1.class)
	public static class Servlet extends VaadinServlet {
	}

	@Override
	protected void init(VaadinRequest request) {
		final VerticalLayout verticalLayout = new VerticalLayout();
		verticalLayout.addStyleName("maincontainer");
		setContent(verticalLayout);

		OlMap olMap = new OlMap();
		olMap.addStyleName("olmapstyle");

		verticalLayout.addComponent(olMap);

	}

}