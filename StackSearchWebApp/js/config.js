var APPDATA = {
	collection:{
		primary:"collection1"
	},
	"facets":{
		'st_site': {
			label: "SITE"
		},
		'st_tags':{
			label: "TAGS"
		},
		'st_posttype':{
			label: "POST TYPE"
		},
		'st_displayname': {
			label: "USERNAME"
		}
	},
	"SOLR_HOST":"localhost",
	"SOLR_PORT":"8983",
	showClusters:0,
	showComments:0,
	
	"startDate":(new Date(new Date().setFullYear(new Date().getFullYear()-6)).format("yyyy-MM-dd hh:mm")), //= NOW - 6years
	"endDate":(new Date().format("yyyy-MM-dd hh:mm"))

};


