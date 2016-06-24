package com.search.util;

import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class DataLoader {

	private String site,mode;
	DBUtil dbi;


	public DataLoader(String site, String mode) {
		this.site = site;
		this.mode  = mode;
	}

	public void load() {

		XMLFileReader reader = new XMLFileReader(site);

		dbi = new DBUtil(this.mode);
		
		NodeList rows = reader.getData("Posts");
		insertPost(rows);
		
		rows = reader.getData("Comments"); 
		insertComments(rows); 
		
		rows = reader.getData("Users"); 
		insertUser(rows);
		
		dbi.commit();
		dbi.close();

	}

	public void insertPost(NodeList nList) {

		for (int count = 0; count < nList.getLength(); count++) {
			if (count == 1) {
				// break;
			}
			Node nNode = nList.item(count);

			// System.out.println("\nCurrent Element :" + nNode.getNodeName());

			if (nNode.getNodeType() == Node.ELEMENT_NODE) {
				Element elem = (Element) nNode;

				String id = elem.getAttribute("Id");
				String post = elem.getAttribute("Body");
				String postType = (elem.getAttribute("PostTypeId")
						.matches("1")) ? "QUESTION" : "ANSWER";
				String creationDate = elem.getAttribute("CreationDate").replaceAll("\\.\\d*", "Z");
				
				//String OwnerUserId = elem.getAttribute("OwnerUserId");
				String parentId = elem.getAttribute("ParentId");
				String acceptedAnsId = elem
						.getAttribute("AcceptedAnswerId");
				String score = elem.getAttribute("Score");
				String title = elem.getAttribute("Title");
				String tags = elem.getAttribute("Tags").replaceAll("><", ",").replaceAll("<|>", "");
				String answerCount = elem.getAttribute("AnswerCount");
				String commentCount = elem.getAttribute("CommentCount");
				String favoriteCount = elem.getAttribute("FavoriteCount");

				Map<String, String> data = new HashMap<String, String>();

				data.put("site", site);
				data.put("postType", postType);
				data.put("id", site + "_" + id);
				data.put("post", post);
				data.put("creationDate", creationDate);
				
				if(score.length() != 0 ) {
					data.put("score", score);
				} else {
					data.put("score", "0");
				}
				
				
				if (postType.matches("QUESTION")) {
					data.put("parentId", "NA");

					if (acceptedAnsId.length() != 0)
						data.put("acceptedAnsId", site + "_" + acceptedAnsId);
					else
						data.put("acceptedAnsId", "NA");

					data.put("title", title);
					data.put("tags", tags);

					if (answerCount.length() != 0)
						data.put("answerCount", answerCount);
					else
						data.put("answerCount", "0");

					if (commentCount.length() != 0)
						data.put("commentCount", commentCount);
					else
						data.put("commentCount", "0");

					if (favoriteCount.length() != 0)
						data.put("favoriteCount", favoriteCount);
					else
						data.put("favoriteCount", "0");

				} else {

					data.put("parentId", site + "_" + parentId);
					data.put("acceptedAnsId", "NA");
					data.put("title", "NA");
					data.put("tags", "NA");
					data.put("answerCount", "0");
					data.put("commentCount", "0");
					data.put("favoriteCount", "0");
				}

				System.out.println("Insert Post: " + data.get("id"));
				dbi.insert("Posts", data);

				if (count % 500 == 0) {
					dbi.commit();
				}

			}

		} // end of for loop

	}

	public void insertComments(NodeList rows) {

		for (int count = 0; count < rows.getLength(); count++) {
			if (count == 1) {
				 //break;
			}
			Node row = rows.item(count);

			if (row.getNodeType() == Node.ELEMENT_NODE) {
				Element elem = (Element) row;

				String id = elem.getAttribute("Id");
				String commentText = elem.getAttribute("Text");
				String score = elem.getAttribute("Score");
				String userId = elem.getAttribute("UserId");
				String postId = elem.getAttribute("PostId");
				
				Map<String, String> data = new HashMap<String, String>();
				
				data.put("id", site + "_" + id);
				data.put("commenttext", commentText);
				
				
				if(score.toString().length() != 0) {
					data.put("score", score);
				} else {
					data.put("score", "0");
				}
				
				data.put("userid", site + "_" + userId);
				data.put("postid", site + "_" + postId);
				
				System.out.println("Insert Comment: " + data.get("id"));
				dbi.insert("Comments", data);

				if (count % 500 == 0) {
					dbi.commit();
				}
				
				
			}
		}
	}

	public void insertUser(NodeList rows) {
		
		for (int count = 0; count < rows.getLength(); count++) {
			
			if (count == 1) {
				// break;
			}
			
			Node row = rows.item(count);

			if (row.getNodeType() == Node.ELEMENT_NODE) {
				Element elem = (Element) row;

				String id = elem.getAttribute("Id");
				if(id.matches("-1")) { 
					continue;
				}
				
				String displayName = elem.getAttribute("DisplayName");
				
				Map<String, String> data = new HashMap<String, String>();
				data.put("id", site + "_" + id);
				data.put("displayName", displayName);
				
				
				System.out.println("Insert User: " + data.get("id"));
				dbi.insert("Users", data);
			}
		}
	}

}
