
module.exports = {
	DestinationType: {
		DATA_BIN: 0,		// Return ArrayBuffer 
		DATA_URL: 1,        // Return base64 encoded string
		FILE_URI: 2         // Return file uri (content://media/external/images/media/2 for Android)
	},
	EncodingType: {
		JPEG: 0,             // Return JPEG encoded image
		PNG: 1               // Return PNG encoded image
	},
	OpenType: {
		PATH: 0,
		BUFFER: 1
	}
};