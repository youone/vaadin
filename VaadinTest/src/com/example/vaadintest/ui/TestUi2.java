package com.example.vaadintest.ui;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.UI;

@SuppressWarnings("serial")
@Theme("reindeer")
public class TestUi2 extends UI {

	@WebServlet(value = {"/test2/*", "/VAADIN2/*"}, asyncSupported = true)
	@VaadinServletConfiguration(productionMode = false, ui = TestUi2.class)
	public static class Servlet extends VaadinServlet {
	}

	@Override
	protected void init(VaadinRequest request) {
		
	}

}