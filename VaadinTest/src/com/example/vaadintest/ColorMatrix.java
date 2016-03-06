package com.example.vaadintest;

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

}
