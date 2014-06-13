function populateResults(response) {
	console.log(response);

	//show time taken by query and number of results found
	var qTime = response['responseHeader']['QTime'] + " ms";
	var numFound = response['response']['numFound'];
	$('#status-message').html(numFound + " matches(" + qTime +")");

	if(numFound == 0) {
		chartOptions.series[0].data = [];
		chart = new Highcharts.Chart(chartOptions);
	}

	//change the pagination depending on number of results found and results-per-page
	if(APPDATA.searchSource != "pagination") {
		initPagination({itemsCount:numFound});
	}

	
	//show facet response
	if(response.hasOwnProperty('facet_counts')) {
		showFacets(response['facet_counts']['facet_fields']);
		populateChart(response['facet_counts']['facet_ranges']['st_creationdate']);
	}

	
	//show cluster response
	if(response.hasOwnProperty('clusters')) {
		showClusters(response['clusters']);
	}


	//show result documents using highlighting response
	if(response.hasOwnProperty('highlighting') && response.hasOwnProperty('response')) {

		showDocs({
			highlighting: response['highlighting'],
			docs: response['response']['docs']
		});
	}
 
}


/*
	this will populate the facets list.
	TODO - facet which is selected at present should not be refreshed....selected facet will be stored in APPDATA.selectedFacet
*/
function showFacets(data) {
	//console.log(data);

	$('#facetvalues').html("");

	$.each(data,function(facetName,facetVals) {

		var label = APPDATA['facets'][facetName]['label'],
			valueHTMLTemplate = "";

		var headerHTMLTemplate = "<label class='facet-heading' facetname='" + facetName +"'>" + 
							   	label + " (" + (facetVals.length)/2 + ")" + 
							  "</label>";


		for(var n=0;n<facetVals.length;n=n+2) {
			var value = facetVals[n];
			var count =  facetVals[(n+1)];

			var checkedStr;
			if(isFacetSeleted(facetName,value)) {
				checkedStr = " checked='checked' ";
			} else {
				checkedStr = "";
				
			}

			valueHTMLTemplate += "<li><label value='" + value + "'>" +
										"<input type='checkbox' " + checkedStr + ">" + value + " (" + count + ")" +
								  "</label></li>";
		}

		$('#facetvalues').append(
			headerHTMLTemplate + "<ul facetname='" + facetName +"'>" + valueHTMLTemplate + "</ul>"
		);

	});

	onFacetSelection();

}


function isFacetSeleted(facetName,value) {
	
	if( $('#filter-bar').find("[facetname='" + facetName + "']").filter("[value='" + value + "']").length > 0 ) {
		return true;
	} else {
		return false;
	}

}

function onFacetSelection() {

	$('#facetvalues').find(':checkbox').change(function() {

		var data = {
			'parent': $(this).parent().parent().parent().attr('facetname'),
			'value' : $(this).parent().attr('value')	
		}

		if($(this).is(':checked')) {
			
			//add the facet on the filter bar
			addNewFacet(data);

		} else {
			//remove the facet from the filter bar
			removeFacet(data);

		}

		

	});
	

}



/* 
	add the selected facet on the filter bar 
*/
function addNewFacet(data) {

	//console.log(data);

	var facetName = data.parent;
	var value = data.value;

	var filterHTMLTemplate = "<span class='filter' value='" + value + "' facetname='" + facetName + "'>" + 
								value + 
								"<img src='img/close2_16.png' /> |" +
							 "</span>";


	$('#filter-bar').append(filterHTMLTemplate);

	APPDATA.searchSource = "facetAdded";
	startSearch();



	//define the on-close-icon-click event handler
	$('#filter-bar').find('span').last().find('img').click(function() {
		var facetname = $(this).parent().attr('facetname');
		var value = $(this).parent().attr('value');

		$('#facetvalues ul').filter("[facetname='" + facetname + "']").find("[value='" + value + "']").find(':checkbox').removeAttr('checked');
		$(this).parent().remove();

		APPDATA.searchSource = "facetRemovedByIconClick";
		startSearch();

	});

}


function removeFacet(data) {

	var facetName = data.parent;
	var value = data.value;

	$('#filter-bar').find("[facetname='"+ facetName + "']").filter("[value='" + value +"']").remove();

	APPDATA.searchSource = "facetRemovedFromCheckbox";
	startSearch();

}




function showClusters(data) {

	var valueHTMLTemplate = "";

	$('#clustervalues').html("");
	$.each(data,function(index,cluster) {

		var label = cluster['labels'][0];
		var score = cluster['score'];  //the health of that cluster
		var docs = cluster['docs'];
		var count = docs.length; //number of docs in result set which belong to that cluster

		var titleText = "Click to only show docs belonging to cluster '" + label +"' ";
		var valueHTMLTemplate = "<li title=\"" + titleText + "\" >" + 
								"<b>" + label + "</b> " +
								"[" + count + " docs]" +
								" ("+ score.toFixed(2) +")" +
							 "</li>";

		$('#clustervalues').append(valueHTMLTemplate);


		//on click of a cluster, minimize all posts which dont belong to that cluster
		$('#clustervalues').find('li').last().bind('click',function() {

			$('#result-list').find('.result-header').dblclick();
			$.each(docs,function(index,id) {
				console.log(id);
				$('#result-list').find('.' + id).find('.result-header').dblclick();
			});

		});



	});

	
}




/*
 this will show the main result list...notice that its using highlighting respone....id field is used for mapping
*/

function showDocs(data) {

	var highlighting = data['highlighting'];
	var docs = data['docs'];


	$('#result-list').html("");
	for(var n=0;n<docs.length;n++) {

		
		//first get required fields from doc response
		var id = docs[n]['id'];
		var postType = docs[n]['st_posttype'];
		var username = docs[n]['st_displayname'];
		var score = docs[n]['st_score'];

		//username is undefined for community posts
		if(username == undefined) {
			username = "Commnunity";
		}
		
		var docHTMLTemplate = "<div class='result-header'>" +
									"<span class='colname-style1'>Type:</span><span class='value-style1'>"+ postType + "</span>" +
									"<span class='colname-style1'>Username:</span> <span class='value-style1'>"+ username + "</span>" +
									"<span class='colname-style1'>Score:</span> <span class='value-style1'>"+ score + "</span>" +
					    	   "</div>";


		//use id field to get snippets from highlighting response.....for the sake of simplicity, we have made snippet count 1...
		//in real world cases you will get multiple snippets per id

		var post = highlighting[id]['st_post'][0];



		//if search query is empty, then remove the highlighting(user is in browsing mode), or else it will highlight whole content
		if($('#querybox').val() == "" || $('#querybox').val() == "*" ) {
			post = post.replace(/<em>/g,'');
			post = post.replace(/<\/em>/g,'');
		}

		docHTMLTemplate += "<div class='result-content highlight'>" + post + "</div>";

		var comments = docs[n]['st_comments'];
		
		//comments may not be present in every document		
		if(comments != undefined) {
			docHTMLTemplate += "<div class='comments'>";
			$.each(comments,function(index,comment) {
				docHTMLTemplate += "<li>" + comment + "</li>";
			});
			docHTMLTemplate += "</div>";
		}

  		docHTMLTemplate = "<div class='result'>" + docHTMLTemplate + "</div>";


  		$('#result-list').append(docHTMLTemplate);
  		$('#result-list').find('.result').last().addClass(id);

	}

	$('.result-header').bind('dblclick',function() {
		$(this).siblings().slideToggle('fast');
	});

}
