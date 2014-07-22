Instructions for Activity-1
===========================

(1) Start single node solr instance 

cd /home/solruser/work/solr-4.8.1/example-minimal
java -jar start.jar


// This will start solr on default port(8983). 
// You can see admin UI at http://localhost:8983

----------------------------------------------------------------------------------------

(2) How to start solr on a differnet port?

cd /home/solruser/work/solr-4.8.1/example-minimal
java -Djetty.port=2001 -jar start.jar

----------------------------------------------------------------------------------------

(3) Index some sample documents

cd /home/solruser/work/sampledata/activity-1
java -jar post.jar docs/doc1.xml
java -jar post.jar docs/doc2.xml

----------------------------------------------------------------------------------------

(4) Open the browser and do a "select-all" query

http://localhost:8983/solr/collection1/select?q=*:*

----------------------------------------------------------------------------------------
