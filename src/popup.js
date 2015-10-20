var chrome = chrome || {};

var gridIsDisplayed = false;

function init(){

	//document.getElementById('removegrid').disabled = true;
	//document.getElementById('updategrid').disabled = true;

	/*
		Will load in saved content already in local storage
	*/
	chrome.storage.sync.get(["largeWidth", "largeColumns", 
									 "smallColumns", "vwUnits", 
									 "smallWidth", "gutters", 
									 "outterGutters"], 
		function(items){

			var largeWidth = items.largeWidth || 960;
			var smallWidth = items.smallWidth || 768;
			var largeColumns = items.largeColumns || 16;
			var smallColumns = items.smallColumns || 8;
			var gutters = items.gutters || 16;
			var outterGutters = items.outterGutters || 16;

			if(items.vwUnits){
				document.getElementById('viewports').checked = true;
			}

			document.getElementById('largeWidth').value = largeWidth;
			document.getElementById('smallWidth').value = smallWidth;
			document.getElementById('largeColumns').value = largeColumns;
			document.getElementById('smallColumns').value = smallColumns;
			document.getElementById('gutters').value = gutters;
			document.getElementById('outterGutters').value = outterGutters;
	});
}


function addGrid(){

	//document.getElementById('addGrid').disabled = true;
	//document.getElementById('removegrid').disabled = false;
	//document.getElementById('updategrid').disabled = false;
    
   var settings = saveCurrentSettings();

   executeCSS(settings);

	//Need to fix this 
	chrome.tabs.insertCSS({ 
    	file: 'src/grid.css'
    }, function() {
        executeJS();
    }); 
}


function upDateGrid(){
	
	var settings = saveCurrentSettings();

   removeGrid();
   executeCSS(settings);

   addGrid();
}


function removeGrid(){

	//document.getElementById('addGrid').disabled = false;
	//document.getElementById('removegrid').disabled = true;
	//document.getElementById('updategrid').disabled = true;

	executeJS();
}


function executeCSS(options){

    chrome.windows.getCurrent(function(currWindow){

	
		var unitWidth = checkIfViewPortIsSelected(document.getElementById('viewports').checked);

		chrome.tabs.insertCSS(null, {
			code: createGridLinesCSS(unitWidth)			
		})


		if(options.gutters > options.outterGutters){
			chrome.tabs.insertCSS(null, {
				code: createGridInnerGreaterOutter(options)			
			})

		}else{
			chrome.tabs.insertCSS(null, {
				code: createGridOuterGreaterInner(options)			
			})
		}

		chrome.tabs.insertCSS(null, {
        code:"@media (max-width:" + options.smallWidth + "px) {" //This will be small -1 
				+ ".grid-overlay-col {"
				 	+ "width: calc(" + (100 / options.smallColumns) + "% - " + (options.gutters) + "px);"
				+ "}"
				+ ".grid-overlay-container {"
					+ "padding:0px " + (options.outterGutters - (options.gutters)) + "px;"
				+ "}"
			+ "}"

    	});

	})

}


/*
	Tesable functions
*/
function checkIfViewPortIsSelected(viewPortSelected){
	if(viewPortSelected){
		return 'vw';
	}else{
		return '%';
	}
}

function createGridLinesCSS(units){	
	return ".cb-grid-lines {"
					+ "width:100" + units 
			+ "}"

}

function createOverlayContainer(options){
	return ".grid-overlay-container {"
			  	+ "max-width:" + options.largeWidth + "px;"
			  	+ "padding:0px " + options.outterGutters + "px;"
			+ "}"
}

function createGridOuterGreaterInner(options){
	return  ".grid-overlay-container {"
			  	+ "max-width:" + options.largeWidth + "px;"
			  	+ "padding:0px " + (options.outterGutters - (options.gutters / 2)) + "px;"
			+ "}"

			+ ".grid-overlay-col {"
				+ "width: calc(" + calcColumnPercents(options) + "% - " + options.gutters + "px);"
				+ "margin: 0 " +  (options.gutters / 2) + "px;"
			+ "}"
}

function createGridInnerGreaterOutter(options){
	return  ".grid-overlay-container {"
			  	+ "max-width:" + options.largeWidth + "px;"
			  	+ "padding:0px " + (options.outterGutters - (options.gutters / 2)) + "px;"
			+ "}"

			+ ".grid-overlay-col {"
				+ "width: calc(" + calcColumnPercents(options) + "% - " + options.gutters + "px);"
				+ "margin: 0 " +  (options.gutters / 2) + "px;"
			+ "}"
}


function calcContainerPadding(options){
	return (options.outterGutters - (options.gutters / 2));
}

function calcColumnPercents(options){
	return (100 / options.largeColumns);
}


function smallScreenGrid(){

}

function executeJS(){
	chrome.tabs.executeScript(null, {file: 'src/grid.js'}); 
}

/*
	Will save the data from form fields 
	into local storage
*/
function saveCurrentSettings(){
	var largeColumns = document.getElementById("largeColumns").value;
	var smallColumns = document.getElementById("smallColumns").value;
   var largeWidth = document.getElementById("largeWidth").value;
   var vwChecked = document.getElementById('viewports').checked;
   var smallWidth = document.getElementById('smallWidth').value;
   var gutters = document.getElementById('gutters').value;
   var outterGutters = document.getElementById('outterGutters').value;

   var options = {
      largeWidth: largeWidth,
      smallWidth: smallWidth,
      largeColumns: largeColumns,
      smallColumns: smallColumns,
      vwUnits: vwChecked,
      gutters: gutters,
      outterGutters: outterGutters
   };

   chrome.storage.sync.set(options);

   return options;
}


document.getElementById('addGrid').addEventListener('click', addGrid);
document.getElementById('removegrid').addEventListener('click', removeGrid);
document.getElementById('updategrid').addEventListener('click', upDateGrid);


init();
//onResizeOfCurrWindow();
