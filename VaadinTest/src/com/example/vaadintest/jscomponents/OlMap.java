package com.example.vaadintest.jscomponents;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;

@SuppressWarnings("serial")
@StyleSheet({
	"http://openlayers.org/en/v3.14.2/css/ol.css"
	})
@JavaScript({
	"vaadin://js/olMap.js", 
	"vaadin://js/lib/arc.js",
	"vaadin://js/lib/triglib.js",
	"http://openlayers.org/en/v3.14.2/build/ol.js"
})
public class OlMap extends AbstractJavaScriptComponent {
	
	public OlMap() {
	}
	
	 @Override
	 protected OlMapState getState() {
		 return (OlMapState) super.getState();
	 }


}
