#undef ABS
#undef MIN
#undef MAX

#include "Common.h"
#include "mupdf/fitz.h"
#include "dispatch/dispatch.h"
#import "MuDocRef.h"

@interface PDFRendererCore : NSObject {
    MuDocRef* docRef;
    fz_display_list* pageList;
    fz_page* page;
}
- (id) init;
- (BOOL) openFile: (char*)path;
- (BOOL) openFile: (NSData*)buffer magic:(char*)magic;
- (void) closeFile;
- (NSInteger) countPages;
- (CGSize) getPageSize: (int)index;
- (BOOL) needsPassword;
- (BOOL) authenticatePassword: (char*)password;
- (BOOL) isFileOpen;
- (UIImage*) drawPage: (int)index pageSize: (CGSize)pageSize patchRect: (CGRect)patchRect;
@end
