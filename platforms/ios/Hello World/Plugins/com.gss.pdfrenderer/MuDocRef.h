#import <Foundation/Foundation.h>

#include "mupdf/fitz.h"

NSData* buffer;

@interface MuDocRef : NSObject {
@public
	fz_document* doc;
	bool interactive;
}
- (id) initWithFilename: (char *)aFilename;
- (id) initWithBuffer: (NSData*)data magic: (char*)magic;
@end
