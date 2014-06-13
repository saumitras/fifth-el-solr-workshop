package com.search.solrj;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import org.apache.http.client.HttpClient;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CloudSolrServer;
import org.apache.solr.client.solrj.impl.HttpClientUtil;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.params.ModifiableSolrParams;

public class IndexerExample {

	public static void main(String s[]) {

		String SOLR_COLLECTION = "collection1";
		String ZOOKEEPER_HOSTS = "localhost:2181";
		String SOLR_HOST = "localhost:8983";

		/*
		 * HttpSolrServer is used for standalone solr instance
		 */
		SolrServer server = new HttpSolrServer("http://" + SOLR_HOST + "/solr/"
				+ SOLR_COLLECTION);

		/*
		 * When connecting to solr cloud, use CloudSolrServer. Provide comma
		 * separated list of zookeeper hosts while creating connection
		 */
		
		/*
		 * CloudSolrServer server = null; try { server = new
		 * CloudSolrServer(ZOOKEEPER_HOSTS);
		 * server.setDefaultCollection(SOLR_COLLECTION); } catch
		 * (MalformedURLException e1) { e1.printStackTrace(); }
		 */

		/*
		 * you can override default connection limits while creating server
		 */
		ModifiableSolrParams params = new ModifiableSolrParams();
		params.add(HttpClientUtil.PROP_MAX_CONNECTIONS_PER_HOST, "300");
		params.add(HttpClientUtil.PROP_MAX_CONNECTIONS, "5000");
		HttpClient httpClient = HttpClientUtil.createClient(params);
		// SolrServer server = new HttpSolrServer(url, httpClient);

		/*
		 * apart from creating server instance, there is no difference in
		 * indexing steps between cloud and standalone setup
		 */

		SampleData data = new SampleData();
		Collection<Map<String, String>> sampleDocs = data.getData();

		/*
		 * we can add a single doc at a time or do batch inserts Create a
		 * SolrInputDocument instance and add fields to it Call server.add to
		 * index single SolrInputDocument or a collection of SolrInputDocument
		 * After adding, if required you can explicitly commit
		 */

		/*
		 * create a collection of docs
		 */
		ArrayList<SolrInputDocument> docList = new ArrayList<SolrInputDocument>();

		for (Map<String, String> docData : sampleDocs) {

			SolrInputDocument doc = new SolrInputDocument();

			doc.addField("id", docData.get("id"));
			doc.addField("st_tags", docData.get("st_tags"));
			doc.addField("st_favoritecount", docData.get("st_favoritecount"));
			doc.addField("st_post", docData.get("st_post"));
			doc.addField("st_posttype", docData.get("st_posttype"));
			doc.addField("st_answercount", docData.get("st_answercount"));
			doc.addField("st_score", docData.get("st_score"));
			doc.addField("st_parentid", docData.get("st_parentid"));
			doc.addField("st_creationdate", docData.get("st_creationdate"));
			doc.addField("st_parentid", docData.get("st_parentid"));
			doc.addField("st_comments", docData.get("st_comments"));
			doc.addField("st_displayname", docData.get("st_displayname"));

			docList.add(doc);

		}

		/*
		 * send docs for indexing
		 */
		if (docList.size() > 0) {
			try {
				server.add(docList);

				server.commit();

			} catch (SolrServerException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}

/*
 * Class to read a sample xml file and create a map of solr docs
 */
class SampleData {

	public Collection<Map<String, String>> getData() {

		File fXmlFile = new File("sampledata\\sample1.xml");

		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = null;
		Document xmlDoc = null;

		Collection<Map<String, String>> docList = new ArrayList<Map<String, String>>();

		try {
			dBuilder = dbFactory.newDocumentBuilder();
			xmlDoc = dBuilder.parse(fXmlFile);
			xmlDoc.getDocumentElement().normalize();

			NodeList docs = xmlDoc.getElementsByTagName("doc");

			for (int n = 0; n < docs.getLength(); n++) {

				Node doc = docs.item(n);

				if (doc.getNodeType() == Node.ELEMENT_NODE) {

					Element elem = (Element) doc;
					NodeList nodeList = doc.getChildNodes();

					System.out.println("Doc " + n);

					Map<String, String> data = new HashMap<String, String>();

					for (int i = 0; i < nodeList.getLength(); i++) {
						Node node = nodeList.item(i);
						if (node instanceof Element) {

							String fieldName = node.getAttributes().item(0)
									.getNodeValue();
							String value = node.getTextContent().trim();

							data.put(fieldName, value);

						}
					}

					docList.add(data);
				}

			}

		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return docList;

	}
}