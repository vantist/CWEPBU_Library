package com.gss.pdfrenderer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.file.LocalFilesystem;
import org.json.JSONException;
import org.json.JSONObject;

import android.accounts.AuthenticatorException;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.PointF;
import android.os.Environment;
import android.util.Base64;
import android.view.Window;

public class PDFRenderer extends CordovaPlugin {
	public final String TAG = "PDFRenderer";
	private static final int DATA_BIN = 0;              // Return ArrayBuffer
	private static final int DATA_URL = 1;              // Return base64 encoded string
	private static final int FILE_URI = 2;              // Return file uri 

	private static final int JPEG = 0;                  // Take a picture of type JPEG
	private static final int PNG = 1;                   // Take a picture of type PNG

	private static final int PATH = 0;
	private static final int BUFFER = 1;

	private final String NUMBER_OF_PAGE = "numberOfPage";
	private final String PAGE_WIDTH = "width";
	private final String PAGE_HEIGHT = "height";
	private final String PDF_PATH = "path";
	private final String PDF_NAME = "name";
	private String SYSTEM_PATH;

	private PDFRendererCore mCore;
	private String mFileName;
	private int mNumberOfPage;
	private String mFilePath;
	private int mCurrentPage;
	private String mCustomPath;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		mFileName = "";
		mFilePath = "";
		mNumberOfPage = 0;
		mCurrentPage = 0;
		mCustomPath = "";
//		SYSTEM_PATH = Environment.getExternalStorageDirectory() + "/Android/data/" + cordova.getActivity().getPackageName() + "/files/PDFRenderer";
		SYSTEM_PATH = cordova.getActivity().getFilesDir().getAbsolutePath();	// /data/data/{package name}/files
		super.initialize(cordova, webView);
	}

	@Override
	public boolean execute(String action, CordovaArgs args, final CallbackContext callback) {
		try {
			if (mCore == null && !action.contentEquals("open")) {
				callback.error("Please open a file.");
				return false;
			}
			Method method = this.getClass().getMethod(action, CordovaArgs.class, CallbackContext.class);
			method.invoke(this, args, callback);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			callback.error(e.getMessage());
		}
		return false;
	}

	public void open(final CordovaArgs args, final CallbackContext callback) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					final int openType = args.getInt(1);
					final String password = args.getString(2);

					closeFile();	// prevent user open new pdf without close last one
					if (openType == PATH) {
						String path = args.getString(0);
						int lastIndexOfSlash = path.lastIndexOf('/');
						int lastIndexOfDot = path.lastIndexOf('.');
						mFileName = new String(lastIndexOfSlash == -1 ? path : path.substring(lastIndexOfSlash + 1, lastIndexOfDot));
						mFilePath = path;
						mCore = new PDFRendererCore(path);
					} else {
						mCore = new PDFRendererCore(args.getArrayBuffer(0), null);
					}
					checkPassword(password);
					checkPDFReady();
					callback.success(preparePDFInfo());
				} catch (Exception e) {
					e.printStackTrace();
					callback.error(e.getMessage());
				}
			}
		});
	}

	public void close(final CordovaArgs args, final CallbackContext callback) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				closeFile();
				callback.success();
			}
		});
	}

	public void getPage(final CordovaArgs args, final CallbackContext callback) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					final int page = args.getInt(0) >= mNumberOfPage ? mNumberOfPage - 1 : args.getInt(0);
					PointF pageSize = mCore.getPageSize(page);
					final int width = args.getInt(1) != -1 ? args.getInt(1) : (int) pageSize.x;
					final int height = args.getInt(2) != -1 ? args.getInt(2) : (int) pageSize.y;
					final int patchX = args.getInt(3);
					final int patchY = args.getInt(4);
					final int patchWidth = args.getInt(5) != -1 ? args.getInt(5) : width;
					final int patchHeight = args.getInt(6) != -1 ? args.getInt(6) : height;
					final int quality = args.getInt(7);
					final int encodingType = args.getInt(8);
					final int destinationType = args.getInt(9);
					final String destinationPath = args.getString(10);

					Bitmap bm = Bitmap.createBitmap(patchWidth, patchHeight, Config.ARGB_8888);
					mCore.drawPage(bm, page, width, height, patchX, patchY, patchWidth, patchHeight, mCore.new Cookie());
					if (destinationType == DATA_BIN) {
						callback.success(encodeToByteArray(bm, encodingType, quality));
					} else if (destinationType == DATA_URL) {
						callback.success(encodeTobase64(bm, encodingType, quality));
					} else if (destinationType == FILE_URI) {
						callback.success(saveImage(bm, page, encodingType, quality, destinationPath));
					}
				} catch (Exception e) {
					e.printStackTrace();
					callback.error(e.getMessage());
				}
			}
		});
	}

	public void getPageInfo(final CordovaArgs args, final CallbackContext callback) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					int n = args.isNull(0) ? mCurrentPage : args.getInt(0);
					final int page = n >= mNumberOfPage ? mNumberOfPage - 1 : n;

					PointF pageSize = mCore.getPageSize(page);
					JSONObject result = new JSONObject();
					result.put(NUMBER_OF_PAGE, mNumberOfPage);
					result.put(PAGE_WIDTH, pageSize.x);
					result.put(PAGE_HEIGHT, pageSize.y);
					callback.success(result);
				} catch (Exception e) {
					e.printStackTrace();
					callback.error(e.getMessage());
				}
			}
		});
	}

	public void getPDFInfo(final CordovaArgs args, final CallbackContext callback) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					callback.success(preparePDFInfo());
				} catch (Exception e) {
					e.printStackTrace();
					callback.error(e.getMessage());
				}
			}
		});
	}
	
	public void changePreference(final CordovaArgs args, final CallbackContext callback) {
		try {
	        mCustomPath = args.getString(0);
			callback.success();
        } catch (JSONException e) {
	        e.printStackTrace();
			callback.error(e.getMessage());
        }
	}

	private JSONObject preparePDFInfo() throws Exception {
		JSONObject result = new JSONObject();
		result.put(PDF_NAME, mFileName);
		result.put(PDF_PATH, mFilePath);
		result.put(NUMBER_OF_PAGE, mNumberOfPage);
		return result;
	}

	private void checkPassword(String password) throws AuthenticatorException {
		if (mCore != null && mCore.needsPassword()) {
			if (password.isEmpty()) {
				throw new AuthenticatorException("The PDF needs password.");
			}
			if (!mCore.authenticatePassword(password)) {
				throw new AuthenticatorException("Password incorrect.");
			}
		}
	}

	private void checkPDFReady() {
		if (mCore != null) {
			mNumberOfPage = mCore.countPages();
			if (mNumberOfPage == 0) {
				closeFile();
				throw new RuntimeException("Can not open document.");
			}
		}
	}

	private void closeFile() {
		if (mCore != null) {
			mCore.onDestroy();
			mCore = null;
		}
		mNumberOfPage = 0;
		mCurrentPage = 0;
		mFileName = "";
		mFilePath = "";
	}

	private String saveImage(Bitmap image, int page, int encodingType, int quality, String destinationPath) throws FileNotFoundException, IOException, NullPointerException {
		File pictureFile = getOutputMediaFile(page, encodingType, destinationPath);
		if (pictureFile == null) {
			throw new NullPointerException("Error creating media file, check storage permissions.");
		}
		FileOutputStream stream = new FileOutputStream(pictureFile);
		image.compress(mappingFormatType(encodingType), quality, stream);
		stream.close();
		return pictureFile.getAbsolutePath();
	}

	private File getOutputMediaFile(int page, int encodingType, String destinationPath) {
		String path = SYSTEM_PATH;
		if (!destinationPath.isEmpty()) {
			path = path + addSlashFirstAndLast(destinationPath);
		} else if (!mCustomPath.isEmpty()) {
			path = path + addSlashFirstAndLast(mCustomPath);
		} else {
			path = path + File.separator + mFileName;
		}
		File mediaStorageDir = new File(path);

		// Create the storage directory if it does not exist
		if (!mediaStorageDir.exists()) {
			if (!mediaStorageDir.mkdirs()) {
				return null;
			}
		}

		File mediaFile;
		String fileName;
		if (encodingType == JPEG) {
			fileName = page + ".jpeg";
		} else {
			fileName = page + ".png";
		}
		mediaFile = new File(mediaStorageDir.getPath() + File.separator + fileName);
		return mediaFile;
	}

	private byte[] encodeToByteArray(Bitmap bm, int encodingType, int quality) {
		Bitmap image = bm;
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		image.compress(mappingFormatType(encodingType), quality, stream);
		byte[] imageByte = stream.toByteArray();
		return imageByte;
	}

	private String encodeTobase64(Bitmap bm, int encodingType, int quality) {
		byte[] imageByte = encodeToByteArray(bm, encodingType, quality);
		return Base64.encodeToString(imageByte, Base64.DEFAULT);
	}

	private Bitmap decodeBase64(String input) {
		byte[] decodedByte = Base64.decode(input, 0);
		return BitmapFactory.decodeByteArray(decodedByte, 0, decodedByte.length);
	}

	private CompressFormat mappingFormatType(int encodingType) {
		CompressFormat format;
		if (encodingType == JPEG) {
			format = Bitmap.CompressFormat.JPEG;
		} else {
			format = Bitmap.CompressFormat.PNG;
		}
		return format;
	}
	
	private String addSlashFirstAndLast(String path) {
		if (path.indexOf(File.separator) != 0) {
			path = File.separator + path;
		}
		int lastIndex = path.length() - 1;
		if (path.lastIndexOf(File.separator) != lastIndex) {
			path = path + File.separator;
		}
		return path;
	}
}
