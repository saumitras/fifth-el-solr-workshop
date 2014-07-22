Instructions for Activity-6
===========================

(1) Start Zookeeper

	cd /home/solruser/work/zookeeper-3.4.6/bin/
	./zkServer.sh start


	// This will start a single zookeeper instance on port 2181
	// Data directory for zookeeper is /var/lib/zookeeper/
	// Config file for zookeeper is /home/solruser/work/zookeeper-3.4.6/conf/zoo.cfg


----------------------------------------------------------------------------------------

(2) Create 2 copies of example folder

	cd /home/solruser/work/solr-4.8.1
	cp -r example node1
	cp -r example node2

	
	// Remove the default "collection1" from both nodes

	rm -rf /home/solruser/work/solr-4.8.1/node1/solr/collection1
	rm -rf /home/solruser/work/solr-4.8.1/node2/solr/collection1


----------------------------------------------------------------------------------------

(4) Start both solr nodes in cloud mode on port 2001 and 2002

	//start 1st node on port 2001

	cd /home/solruser/work/solr-4.8.1/node1
	java -Djetty.port=2001 -DzkHost=localhost:2181 -Dbootstrap_conf=false -jar start.jar 


	//start 2nd node on port 2002

	cd /home/solruser/work/solr-4.8.1/node2
	java -Djetty.port=2002 -DzkHost=localhost:2181 -Dbootstrap_conf=false -jar start.jar 


----------------------------------------------------------------------------------------

(3) Upload a configSet to zookeeper. This will be used to create collections

	cd /home/solruser/work/solr-4.8.1/node1/scripts/cloud-scripts

	./zkcli.sh -cmd upconfig -z localhost:2181 -d /home/solruser/work/sampledata/activity-6/collection1_ConfigSet -n collection1


----------------------------------------------------------------------------------------

(5) Create a collection using the uploaded configSet

	http://localhost:8983/solr/admin/collections?action=CREATE&name=collection1&numShards=2&replicationFactor=1&collection.configName=collection1

----------------------------------------------------------------------------------------

(6) Index some documents using SolrJ's CloudSolrServer Client

	Open SolrDemo project and run "com.search.solrj.CloudIndexer"
	It will index some xml documents from directory /home/solruser/work/sampledata/activity-6/docs/

