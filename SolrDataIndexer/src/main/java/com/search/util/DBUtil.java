package com.search.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

public class DBUtil {

	private static final String DBUSERNAME = "solruser";
	private static final String DBPASSWORD = "solruser";
	private static final String MYSQL_HOST = "localhost";
	private static final int MYSQL_PORT = 3306;
	
	private static final String DBNAME = "stacksearch";
	private static final String USER_TABLE = "user";
	private static final String POSTS_TABLE = "post";
	private static final String COMMENTS_TABLE = "comments";
	
	private static final String connectionString = "jdbc:mysql://" + MYSQL_HOST + ":" + MYSQL_PORT + "/" + DBNAME +
				"?&allowMultiQueries=true&user=" + DBUSERNAME +"&password=" + DBPASSWORD;
	
	private Connection connect = null;
	private PreparedStatement preparedStatement = null;
	
	
	public DBUtil(String mode) {
		
		try {
			connect = DriverManager.getConnection(connectionString);
			connect.setAutoCommit(false);

			if (mode == "clean") {
				truncateAllTables();
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	

	public void insert(String type, Map<String, String> data) {

		if (type.matches("Posts")) {
			insertPostsData(data);
		} else if (type.matches("Comments")) {
			insertCommentData(data);
		} else if (type.matches("Users")) {
			insertUserData(data);
		}

	}

	public void insertPostsData(Map<String, String> data) {
		
		try {
			preparedStatement = connect
					.prepareStatement("insert into  " + DBNAME + "." + POSTS_TABLE
							+ "(id, site, posttype, post, creationdate, score, parentid, acceptedansid, title, tags, answercount, commentcount, favoritecount) "
							+ "values (?,?,?,?,?,?,?,?,?,?,?,?,?)");

			preparedStatement.setString(1, data.get("id").toString());
			preparedStatement.setString(2, data.get("site").toString());
			preparedStatement.setString(3, data.get("postType").toString());
			preparedStatement.setString(4, data.get("post").toString());
			preparedStatement.setString(5, data.get("creationDate").toString());
			preparedStatement.setString(6, data.get("score").toString());
			preparedStatement.setString(7, data.get("parentId").toString());
			preparedStatement
					.setString(8, data.get("acceptedAnsId").toString());
			preparedStatement.setString(9, data.get("title").toString());
			preparedStatement.setString(10, data.get("tags").toString());
			preparedStatement.setString(11, data.get("answerCount").toString());
			preparedStatement
					.setString(12, data.get("commentCount").toString());
			preparedStatement.setString(13, data.get("favoriteCount")
					.toString());
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	public void insertCommentData(Map<String, String> data) {
		
		try {
			preparedStatement = connect
					.prepareStatement("insert into  " + DBNAME + "." + COMMENTS_TABLE
							+ "(id, postid, score, userid, commenttext) "
							+ "values (?,?,?,?,?)");

			preparedStatement.setString(1, data.get("id").toString());
			preparedStatement.setString(2, data.get("postid").toString());
			preparedStatement.setString(3, data.get("score").toString());
			preparedStatement.setString(4, data.get("userid").toString());
			preparedStatement.setString(5, data.get("commenttext").toString());
			
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void insertUserData(Map<String, String> data) {
		
		try {
			preparedStatement = connect
					.prepareStatement("insert into  " +  DBNAME + "." + USER_TABLE
							+ "(id, displayname) "
							+ "values (?,?)");

			preparedStatement.setString(1, data.get("id").toString());
			preparedStatement.setString(2, data.get("displayName").toString());
			
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}


	}

	public void commit() {
		try {
			connect.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void close() {
		try {
			connect.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	
	public void truncateAllTables() {
		Statement stmt = null;
		try {
			stmt = connect.createStatement();
			stmt.execute("DELETE FROM user; DELETE FROM post; DELETE FROM comments");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
}
