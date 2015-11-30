var argscheck = require('cordova/argscheck'),
	exec = require('cordova/exec'),
	PDFRenderer = require('./PDFRendererConstants');

var pdfRendererExport = {};
var GSS_PDFRenderer = "PDFRenderer";
var preference = {
	openType: PDFRenderer.OpenType.PATH,
	quality: 100,
	encodingType: PDFRenderer.EncodingType.JPEG,
	destinationType: PDFRenderer.DestinationType.DATA_BIN,
	destinationPath: ''
};

pdfRendererExport.changePreference = function(options) {
	argscheck.checkArgs('O', 'PDFRenderer.changePreference', arguments);
    options = options || {};
    var getValue = argscheck.getValue;

    preference.openType = getValue(options.openType, preference.openType);
	preference.quality = getValue(options.quality, preference.quality);
	preference.encodingType = getValue(options.encodingType, preference.encodingType);
	preference.destinationType = getValue(options.destinationType, preference.destinationType);
	preference.destinationPath = getValue(options.destinationPath, '');

	var args = [preference.destinationPath];
	exec(null, null, GSS_PDFRenderer, "changePreference", args);
	return preference;
}

// pdfRendererExport.changePreference = function(successCallback, errorCallback, options) {
// 	argscheck.checkArgs('FFO', 'PDFRenderer.changePreference', arguments);
//     options = options || {};
//     var getValue = argscheck.getValue,
// 		success = function(data) {
// 			successCallback(preference);
// 		};

//     preference.openType = getValue(options.openType, preference.openType);
// 	preference.quality = getValue(options.quality, preference.quality);
// 	preference.encodingType = getValue(options.encodingType, preference.encodingType);
// 	preference.destinationType = getValue(options.destinationType, preference.destinationType);
// 	preference.destinationPath = getValue(options.destinationPath, '');

// 	var args = [preference.destinationPath];
// 	exec(success, errorCallback, GSS_PDFRenderer, "changePreference", args);
// }

pdfRendererExport.open = function(successCallback, errorCallback, options) {
	argscheck.checkArgs('FFO', 'PDFRenderer.open', arguments);
    options = options || {};
    var getValue = argscheck.getValue;
    
    var content = getValue(options.content, ""),
    	openType = getValue(options.openType, preference.openType),
    	password = getValue(options.password, "");
    
    var args = [content, openType, password];
    exec(successCallback, errorCallback, GSS_PDFRenderer, "open", args);
};

pdfRendererExport.close = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, GSS_PDFRenderer, "close", []);
};

pdfRendererExport.getPage = function(successCallback, errorCallback, options) {
	argscheck.checkArgs('FFO', 'PDFRenderer.getPage', arguments);
	options = options || {};
	var getValue = argscheck.getValue;
  
	var page = getValue(options.page, 0),
		width = getValue(options.width, -1),
		height = getValue(options.height, -1),
		patchX = getValue(options.patchX, 0),
		patchY = getValue(options.patchY, 0),
		patchWidth = getValue(options.patchWidth, width),
		patchHeight = getValue(options.patchHeight, height),
		quality = getValue(options.quality, preference.quality),
		encodingType = getValue(options.encodingType, preference.encodingType),
		destinationType = getValue(options.destinationType, preference.destinationType),
		destinationPath = getValue(options.destinationPath, preference.destinationPath);
	
	var args = [page, width, height, patchX, patchY, patchWidth, patchHeight, quality, encodingType, destinationType, destinationPath];
    exec(successCallback, errorCallback, GSS_PDFRenderer, "getPage", args);
};

pdfRendererExport.getPDFInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, GSS_PDFRenderer, "getPDFInfo", []);
};

pdfRendererExport.getPageInfo = function(successCallback, errorCallback, page) {
	var args = [];
	if (page) {
		args.push(page);
	}
    exec(successCallback, errorCallback, GSS_PDFRenderer, "getPageInfo", args);
};

module.exports = pdfRendererExport;
