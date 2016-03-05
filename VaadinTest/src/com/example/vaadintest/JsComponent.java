package com.example.vaadintest;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;

import elemental.json.JsonArray;

@StyleSheet({"vaadin://css/scatter.css"})
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

	 @Override
	 protected JsComponentState getState() {
		 return (JsComponentState) super.getState();
	 }

}
