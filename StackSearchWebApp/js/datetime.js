function initDatePicker() {
	$('#start-date-div').datetimepicker({
		format:'Y-m-d H:i'
	});
	$('#end-date-div').datetimepicker({
		format:'Y-m-d H:i'
	});

	
	$('#start-date-div').val(APPDATA.startDate);
	$('#end-date-div').val(APPDATA.endDate);
	
}

function getDateFilterQuery() {
	var dates = getPluginDateInSolrFormat();

	var fq = "st_creationdate:[" + dates.start + " TO " + dates.end + "]";

	return fq;


}


function getPluginDateInSolrFormat() {
	var startDate = $('#start-date-div').val();
	var endDate = $('#end-date-div').val();

	startDate = startDate.replace(/ /,'T') + ":00Z";
	endDate = endDate.replace(/ /,'T') + ":59Z";

	return {
		start:startDate,
		end:endDate
	};
}

function changeDateInPlugin(params) {
	$('#start-date-div').val(params.startDate);
	$('#end-date-div').val(params.endDate);
}
