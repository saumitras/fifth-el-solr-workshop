package com.search.solrj;

import java.util.Iterator;
import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;

import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;

public class QueryExample {

	public static void main(String s[]) {

		String SOLR_COLLECTION = "collection1";
		String ZOOKEEPER_HOSTS = "localhost:2181";
		String SOLR_HOST = "localhost:8983";

		String url = "http://" + SOLR_HOST + "/solr/" + SOLR_COLLECTION;
		SolrServer server = new HttpSolrServer(url);

		SolrQuery query = new SolrQuery();

		// set q params
		query.setQuery("st_post:sensor+data");

		// set facet fields
		query.setFacet(true);
		query.addFacetField("st_displayname");
		query.addFacetField("st_tags");

		// set sort field
		query.addSort("st_score", ORDER.desc);

		// add highlighting
		query.setHighlight(true);
		query.setHighlightSnippets(1);
		query.setParam("hl.fl", "st_post");

		query.setParam("wt", "json");

		
		
		// execute the query
		try {
			
			QueryResponse response = server.query(query);
			// System.out.println(rsp.toString());

			//get query time
			System.out.println("Query Time: " + response.getQTime());
			

			//get facet response
			Iterator<FacetField> facetResponse = response.getFacetFields().iterator();
			while(facetResponse.hasNext()) {
				FacetField facet = facetResponse.next();
				
				System.out.println("FacetName= " + facet.getName() + " Count= " + facet.getValueCount());
				
				List<Count> values = facet.getValues();
				for(int i=0;i<values.size();i++) {
					//System.out.println("Value: " + values.get(i).getName() + " Count: " + values.get(i).getCount());
				}
			}
			
			
			//get field values and highligting response
			Iterator<SolrDocument> resultDocs = response.getResults().iterator();
			while (resultDocs.hasNext()) {
				SolrDocument resultDoc = resultDocs.next();

				String id = (String) resultDoc.getFieldValue("id");
				String score = (String) resultDoc.getFieldValue("score");
				String post = (String) resultDoc.getFieldValue("st_post");
				 

				if (response.getHighlighting().get(id) != null) {
					List<String> highlightSnippets = response.getHighlighting()
							.get(id).get("st_post");
					//System.out.println(highlightSnippets);
				}
			}

		} catch (SolrServerException e) {
			e.printStackTrace();

		}
	}
}
