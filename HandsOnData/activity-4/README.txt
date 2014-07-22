Instructions for Activity-4
===========================

(1) Start MySQL

	sudo /etc/init.d/mysqld start

----------------------------------------------------------------------------------------

(2) Create MySQL database and tables

	cd /home/solruser/work/sampledata/activity-4
	mysql < mysql-schema.sql -u solruser -p        //enter password = solruser

	// This will create stacksearch database and 3 MySQL tables(Comments, Post, User)
	// Open SQuireel-SQL, select "stacksearch" from catalog and and see table definitions

----------------------------------------------------------------------------------------

(3) Load stackexchange data in MySQL using eclipse project

	// Open SolrDemo project and run com.search.mysqlutil.StackExchangeLoader
	// It will load data in MySQL from /home/solruser/work/sampledata/stackexchange-data/
	// Verify in SQuirrel-SQL that data is populated

----------------------------------------------------------------------------------------

(4) Copy mysql connector in solr "dist" directory

	cp /home/solruser/work/sampledata/activity-4/mysql-connector-java-5.1.29-bin.jar /home/solruser/work/solr-4.8.1/dist/

----------------------------------------------------------------------------------------

(5) Add mysql-connector-java-5.1.29-bin.jar dependency in solrconfig.xml

	Open /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf/solrconfig.xml and add following lines:

	<lib dir="../../../dist/" regex="solr-dataimporthandler-\d.*\.jar" />
	<lib dir="../../../dist/" regex="mysql-connector-java-5.1.29-bin.jar" />

	
	// Note: You need to restart solr to make this dependency visible


----------------------------------------------------------------------------------------

(6) Create a config file which will be used by data-import handler

	cp /home/solruser/work/sampledata/activity-4/stackexchange-dataimport-config.xml  /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf


----------------------------------------------------------------------------------------

(7) Defining a data-import request handler in solrconfig.xml

	Add following lines in /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf/solrconfig.xml

	
	<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">
	    <lst name="defaults">
	       <str name="config">data-config.xml</str>
	    </lst>
	</requestHandler>


----------------------------------------------------------------------------------------

(8) You can start data import in 2 ways:
	
	a. From Admin UI: http://localhost:8983/solr/#/collection1/dataimport//dataimport
	
	OR
	
	b. Run http://localhost:8983/solr/collection1/dataimport?command=full-import


----------------------------------------------------------------------------------------

