## PDFRenderer
### 0.0.1-dev
* How to build library
	* Prerequires
		1. minNDK = `ndk-r10d`
		2. build muPDF `reference: http://www.mupdf.com/docs/how-to-build-mupdf-for-android`
	* Android
		* create new cordova project
		* copy muPDF source to PDFRenderer
			- resources
			- scripts
			- thirdparty
			- source
		* unmark PDFRenderer jni directory under plugin.xml
		* install PDFRenderer
			- cordova plugin add {PDFRenderer path}
		* add native support (usgin eclipse)
		* build project (using eclipse)
	* iOS
		* using muPDF iOS native app to build library by xcode 
* 0.0.1-dev tests
	* Only Android for now
	* Prerequires
		1. install cordova-test-framework
			- cordova plugin add https://github.com/apache/cordova-plugin-test-framework.git
		2. install PDFRenderer tests 
			- cordova plugin add {PDFRenderer path}/tests
		3. Get Ready a file with name: PDFRendererTest.pdf and password 1234
		4. Put file to /storage/emulated/0/Download/PDFRendererTest.pdf
		5. change the config.xml to cdvtests/index.html
	* Step
		1. cordova run android
		2. see the phone or emulator running result

### 0.0.2-dev
* release note
	* it can use your own custom path now
	* iOS
		* fix error cause by new version swift sdk
	* 0.0.2-dev tests
		* add test to new functionality


### 0.0.3-dev
* release note
	* change the system path to internal storage
	* 0.0.3-dev tests
		* update test

### 0.0.4-dev
* release note
	* Android
		* fix memory usage overhead at bitmap
	* iOS
		*  add ipad support
		*  simplify the install step
		*  
### 0.0.5-dev
* release note
	* iOS
		* fix zoom in/out

### 0.0.6-dev
* release note
	* iOS
		* fix return same page bug
		* fix zoom in/out bug