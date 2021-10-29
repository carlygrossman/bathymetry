
google.charts.load('current');
google.charts.setOnLoadCallback(init);

// set defaultErrorMessage
var defaultErrorMessage = "Oopsies! Looks like there was a problem with your data file. Did you check to make sure that the Share setting is set to 'Anyone with the link'?";
var errorDiv = document.getElementById('errorMessage');

		
function init() {
}
		
function generateGraph() {

	// var url = 'https://docs.google.com/spreadsheets/d/19pvUkYDkw19fO9hlgHlSsrQgzzli8aNLkJo0A3EW51E/edit#gid=0';
	
	// get spreadsheetURL from text field
	var url = document.getElementById('spreadsheetURL').value;

	// validate URL
  	let testURL;
  
	try {
		testURL = new URL(url);
	} catch (_) {
		errorDiv.innerHTML = url + " is not a valid URL";
		return false;  
	}	
		
	try {
		var query = new google.visualization.Query(url);
		query.setQuery('select B,C,D,E,F,G,H,I,J,K,L,M,N');
		query.send(processSheetsData);
	} catch (error) {
		errorDiv.innerHTML = defaultErrorMessage;
		return false;
	}
	
}
	    
function processSheetsData(response) {
	var z_data = [];

	try {
		var data = response.getDataTable();
		var columns = data.getNumberOfColumns();
		var rows = data.getNumberOfRows();
	} catch (error) {
		errorDiv.innerHTML = defaultErrorMessage;
		return false;
	}	
	for (var c = 0; c < columns; c++) {
		var col = [];
		for (var r = 0; r < rows; r++) {
			// check if value is not a number
			var rowValue = r + 1;
			var formattedValue = data.getFormattedValue(r, c);
			if (Number.isNaN(parseFloat(formattedValue))) {
				errorDiv.innerHTML = "Value at " + String.fromCharCode(65 + c) + ":" + rowValue.toString() + " is not a number.";
				return false;
			} else {
				col.push(formattedValue);
			}
		}
		z_data.push(col);
	}

	// console.log(z_data);

	var data = [{
		z: z_data,
		type: 'surface'
	}];

	var layout = {
		title: 'Map of Sea Floor',
		autosize: true,
		width: 750,
		height: 750,
		margin: {
		l: 65,
		r: 50,
		b: 65,
		t: 90,
		}
	};
		
	Plotly.newPlot('surfacePlot', data, layout);
}
