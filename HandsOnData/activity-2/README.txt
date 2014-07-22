Instructions for Activity-2
===========================

(1) Add fields in "collection1" schema for stackexchange data

	cp /home/solruser/work/sampledata/activity-2/schema.xml  /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf/schema.xml

----------------------------------------------------------------------------------------

(2) Indexing 1 sample document

	cd /home/solruser/work/sampledata/activity-2/
	java -jar post.jar docs/robotics_1.xml


----------------------------------------------------------------------------------------

(3) Query to select all documents

	http://localhost:8983/solr/collection1/select?q=*:*

----------------------------------------------------------------------------------------

(4) Query to delete all documents

	http://localhost:8983/solr/collection1/update?stream.body=<delete><query>*:*</query></delete>&commit=true


----------------------------------------------------------------------------------------

(5) Add a custom datatype in schema.xml


	Add following fieldType in /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf/schema.xml


	<fieldType name="my_custom_type" class="solr.TextField" positionIncrementGap="100">
      <analyzer>
        <tokenizer class="solr.KeywordTokenizerFactory"/>
        <filter class="solr.LowerCaseFilterFactory" />
        <filter class="solr.PatternReplaceFilterFactory" pattern="(\d\d\d\d)" replacement="****" replace="all"/>
      </analyzer>
    </fieldType>

