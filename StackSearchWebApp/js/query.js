var termRequest, searchRequest;

function querySolr() {

//	var params = getQueryParams();

	$('#status-message').html("Searching...");

	var q = getQueryParams()['q'];
	var rows = $('#rows').val();
	var sort = $('#sort').val();

	var start = ($('#pagination').pagination('getCurrentPage') - 1) * $('#rows').val();
	var fq = getDateFilterQuery();

	gap = getChartGap(); //BEWARE: gap is a global varibale

	var dates = getPluginDateInSolrFormat();

	var params = {
		"q" :q,
		"rows" : rows,
		"fl" : "id,st_post,st_posttype,st_tags,st_comments,st_displayname,st_score,st_title",
		"fq" : fq,
		"qf" : "st_post",
		"clustering": true,
		"clustering.results":true,
		"carrot.title" : "st_post",
		"wt" : "json",
		"facet": true,
		"facet.limit":20000,
		"facet.range":"st_creationdate",
		"facet.range.start":dates.start, //"2012-01-01T01:33:06Z",
		"facet.range.end":dates.end, //"2012-12-12T01:33:06Z",
		"facet.range.gap":gap, //"+1MONTH/MONTH",
		"hl":true,
		"sort":sort,
		"start":start,
		"defType":"edismax"
	};
 

 	if(searchRequest) {
		searchRequest.abort();
	}
	

	chart.showLoading();

    searchRequest = $.ajax ({
        
        url : "http://" + APPDATA.SOLR_HOST + ":" + APPDATA.SOLR_PORT + "/solr/collection1/stacksearch",
        type : 'GET',
        data : params,
        dataType : 'jsonp',
        jsonp: 'json.wrf',
        success : function(response) {
            populateResults(response);
            
        },
        fail : function() {
        	$('#status-message').html("Unable to fetch query results.")

         
        }
    });

}


function getQueryParams() {

	var params = {};

	//get search query text
	var searchtext = $('#querybox').val();

	var queryString;
	if(searchtext == "" || searchtext == "*") {
		queryString = "st_post:(*)";
	} else {
		//queryString = "st_post:(\"" + searchtext + "\")";
		queryString = "st_post:" + searchtext + " ";
	}

	
	var facetQueryString = getFacetQueryString();
	if(facetQueryString != "") {
		queryString += " AND " + facetQueryString;
	}

	params['q'] = queryString;

	return params;


}

function getFacetQueryString() {
	
	var tempArray = [];
	
	$.each((getSelectedFacets()),function(facetName,valueArray) {
		 var str = facetName + ":(\"" + valueArray.join('" OR "') + "\")"
		 tempArray.push(str);
	});

	return tempArray.join(' AND ');

}

function getSelectedFacets() {

	var facets = {};
	$('#filter-bar span').each(function() {
		
		var facetName = $(this).attr('facetname');
		var value = $(this).attr('value');

		if(facets.hasOwnProperty(facetName)) {
			facets[facetName].push(value);
		} else {
			facets[facetName] = [value];
		}

	});

	return facets;
}




function getAutoComplete() {

	//var u1 = "http://localhost:8983/solr/collection1/terms?terms.fl=st_post&terms.prefix=da"
	var url = "http://" + APPDATA.SOLR_HOST + ":" + APPDATA.SOLR_PORT + "/solr/" + APPDATA.collection.primary + "/terms";
	

	var keyword = $("#querybox").val();

	keyword = keyword.replace(/.*? /,'');

	console.log("keword= " + keyword);

	var params = {
		"terms.fl" : "st_post",
		"terms.prefix" : keyword,
		"wt":"json"
	};

	if(termRequest) {
		termRequest.abort();
	}

	termRequest = $.ajax ({
        url : url,
        type : 'GET',
        data : params,
        dataType : 'jsonp',
        jsonp: 'json.wrf',

        success : function(response) {
        	//console.log(response);
            var terms = response.terms.st_post;

            var list = [];

            for(var i=0;i<terms.length;i=i+2) {
            	list.push([terms[i]]);
        	}

        	//initAutoComplete(list.join("','"));
        	initAutoComplete(list);
        }
    });


}