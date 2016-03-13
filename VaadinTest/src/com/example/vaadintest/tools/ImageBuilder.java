package com.example.vaadintest.tools;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;

import javax.imageio.ImageIO;

import com.example.vaadintest.tools.ImageResizer;

public class ImageBuilder {

	public String imageData = null;
	BufferedImage bufferedimage = null;
	BufferedImage resizedImage = null;

	public ImageBuilder() {
		makeNewImage();
	}

	public void makeNewImage() {
		
		System.out.println("making new image");
		
		int aspect = 5;
		int nPatchesWidth = 10;
		int nPatchesHeight = 5*195;
		int patchWidth = 100;

		int width = nPatchesWidth * patchWidth;
		int height = width * aspect;
		int patchHeight = height/nPatchesHeight;
		
		BufferedImage bufferedimage = new BufferedImage(width, nPatchesHeight * patchHeight, BufferedImage.TYPE_INT_RGB);

		Graphics2D graphics = bufferedimage.createGraphics();

		for (int i = 0; i < nPatchesWidth; i++ ) {
			for (int j = 0; j < nPatchesHeight; j++ ) {
				graphics.setColor(Color.getHSBColor((float) Math.random(), 1.0F, 1.0F));
				graphics.fillRect(i*patchWidth, j*patchHeight, patchWidth, patchHeight);	
			}
		}

		resizedImage = ImageResizer.PROGRESSIVE_BICUBIC.resize(bufferedimage, 75, 75*aspect);

	    try {
		    ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        ImageIO.write(resizedImage, "png", bos);
	        byte[] imageBytes = bos.toByteArray();
	        imageData = Base64.getEncoder().encodeToString(imageBytes);
	        bos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public String buildImage(HashMap<String, Float[][]> colorMatrixData) {

		Float[][] vData = colorMatrixData.get("v");
		 
		int aspect = 5;
		int nPatchesWidth = vData.length;
		int nPatchesHeight = vData[0].length;
		int patchWidth = 100;

		int width = nPatchesWidth * patchWidth;
		int height = width * aspect;
		int patchHeight = height/nPatchesHeight;
		
		BufferedImage bufferedimage = new BufferedImage(width, nPatchesHeight * patchHeight, BufferedImage.TYPE_INT_RGB);

		Graphics2D graphics = bufferedimage.createGraphics();

		for (int iWidth = 0; iWidth < nPatchesWidth; iWidth++ ) {
			for (int iHeight = 0; iHeight < nPatchesHeight; iHeight++ ) {
				graphics.setColor(Color.getHSBColor(vData[iWidth][iHeight]/360, 1.0F, 1.0F));
				graphics.fillRect(iWidth*patchWidth, iHeight*patchHeight, patchWidth, patchHeight);	
			}
		}

		resizedImage = ImageResizer.PROGRESSIVE_BICUBIC.resize(bufferedimage, 75, 75*aspect);

	    String pngData = null;
		try {
		    ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        ImageIO.write(resizedImage, "png", bos);
	        byte[] imageBytes = bos.toByteArray();
	        pngData  = Base64.getEncoder().encodeToString(imageBytes);
	        bos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	    
	    return pngData;

	}
}
