Instructions for Activity-5
===========================

(1) Add a custom request handler in solrconfig.xml

	a. Copy the requestHandler snippet from /home/solruser/work/sampledata/activity-5/stacksearch-request-handler.txt
	b. Add it to /home/solruser/work/solr-4.8.1/example-minimal/solr/collection1/conf/solrconfig.xml

----------------------------------------------------------------------------------------

(2) Configure autosuggest

	Follow the steps mentioned in activity-5/autosuggest.txt to configure autosuggest and spellcheck

----------------------------------------------------------------------------------------

Queries:

Simple text search
http://localhost:8983/solr/collection1/stacksearch?q=data

Change number of rows retrieved
http://localhost:8983/solr/collection1/stacksearch?q=data&rows=20

Pagination
http://localhost:8983/solr/collection1/stacksearch?q=data&rows=20&start=50


Searching on a field
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data
http://localhost:8983/solr/collection1/stacksearch?q=st_posttype:data


Specifying list of fields to be retrieved
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&fl=id,st_post,st_tags


Delete all documents
http://localhost:8983/solr/collection1/update?stream.body=<delete><query>*:*</query></delete>&commit=true


Searching multiple fields
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data AND st_posttype:QUESTION


NOT query
http://localhost:8983/solr/collection1/stacksearch?q=NOT st_post:data


Boolean query
http://localhost:8983/solr/collection1/stacksearch?q=st_post:(data+sensor)
http://localhost:8983/solr/collection1/stacksearch?q=st_post:(data OR sensor)


Sort Query
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&fl=id,st_post,st_score&sort=st_score desc


Enable faceting on 2 fields
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&facet=true&facet.field=st_posttype&facet.field=st_tags


Changing facet limit and mincount
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&facet=true&facet.field=st_posttype&facet.field=st_tags&facet.limit=1000&facet.mincount=1


Changing facet method
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&facet=true&facet.field=st_posttype&facet.field=st_tags&facet.limit=1000&facet.mincount=1&facet.method=enum


Stats Query
http://localhost:8983/solr/collection1/select?q=*:*&rows=0&stats=true&stats.field=st_creationdate


Facet Range Query
http://localhost:8983/solr/collection1/select?q=*:*&rows=0&facet=true&facet.range=st_creationdate&facet.range.start=2011-03-22T01:33:06Z&facet.range.end=2014-03-22T01:33:06Z&facet.range.gap=%2B1YEAR


Range
http://localhost:8983/solr/collection1/select?q=st_score:[1 TO 3]&fl=id,st_score


Boosting on a field
http://localhost:8983/solr/select?defType=dismax&q=data&bq=st_posttype:QUESTION^5.0&qf=st_post


Fuzzy Search
http://localhost:8983/solr/collection1/select?defType=dismax&q=electromagnet~0.9&qf=st_post


Proximity search
http://localhost:8983/solr/collection1/stacksearch?q=“calculating coordinates”~2


Function Queries
http://localhost:8983/solr/collection1/select?q=*:*&fl=sum(st_score,st_favoritecount),st_score,st_favoritecount
http://localhost:8983/solr/collection1/select?q=*:*&fl=max(st_score,st_favoritecount),st_score,st_favoritecount
http://localhost:8983/solr/collection1/select?q=*:*&fl=ms(NOW,st_creationdate),st_creationdate
http://localhost:8983/solr/collection1/select?q=st_title:*&fl=norm(st_title),st_title


Term Query
http://localhost:8983/solr/collection1/terms?terms.fl=st_post&terms.prefix=data

Group Query
http://localhost:8983/solr/collection1/select?q=st_post:*&group=true&group.field=st_site


More Like This
http://localhost:8983/solr/collection1/select?q=id:robotics_1&mlt.count=5&mlt=true&mlt.fl=st_post


Clustering
http://localhost:8983/solr/collection1/stacksearch?q=st_post:data&clustering=true&clustering.results=true&carrot.title=st_post&rows=20
