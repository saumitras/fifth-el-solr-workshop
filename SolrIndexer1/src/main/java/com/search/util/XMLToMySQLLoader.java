package com.search.util;

public class XMLToMySQLLoader {
	
	public static void main(String[] args)  {

		String sites[] = {"robotics"};
		
		for (String site : sites) {
			DataLoader loader = new DataLoader(site,"clean");
			loader.load();
		}
	}
	
}


