#include "Common.h"
#include "mupdf/pdf.h"
#import "MuDocRef.h"

@implementation MuDocRef

- (id) initWithFilename: (char *)aFilename {
	self = [super init];
	if (self) {
		dispatch_sync(queue, ^{});

		fz_var(self);

		fz_try(ctx) {
			doc = fz_open_document(ctx, aFilename);
			if (!doc) {
				self = nil;
			} else {
				pdf_document *idoc = pdf_specifics(doc);
				if (idoc) pdf_enable_js(idoc);
				interactive = (idoc != NULL) && (pdf_crypt_version(idoc) == 0);
			}
		} fz_catch(ctx) {
            if (self) {
				if (doc != NULL)
					fz_close_document(doc);
				self = nil;
			}
		}
	}
	return self;
}

- (id) initWithBuffer: (NSData*)data magic: (char*)magic {
    self = [super init];
    if (self) {
        dispatch_sync(queue, ^{});
        fz_stream* stream = nil;
        fz_var(self);
    
        fz_try(ctx) {
            buffer = data;
            buffer_state* bs = fz_malloc_struct(ctx, buffer_state);
            stream = fz_new_stream(ctx, bs, bufferStreamNext, bufferStreamClose, nil);
            stream->seek = bufferStreamSeek;
            doc = fz_open_document_with_stream(ctx, magic, stream);
            if (!doc) {
                self = nil;
            } else {
                pdf_document *idoc = pdf_specifics(doc);
                if (idoc) pdf_enable_js(idoc);
                interactive = (idoc != NULL) && (pdf_crypt_version(idoc) == 0);
            }
        } fz_always(ctx) {
            fz_close(stream);
        } fz_catch(ctx) {
            if (self) {
                if (doc != NULL)
                    fz_close_document(doc);
                self = nil;
            }
        }
    }
    return self;
}

- (void) dealloc {
	__block fz_document *block_doc = doc;
	dispatch_async(queue, ^{
		fz_close_document(block_doc);
	});
}

typedef struct buffer_state_s {
    char buffer[4096];
}
buffer_state;

static int bufferStreamNext(fz_stream *stream, int max) {
    buffer_state* bs = (buffer_state*)stream->state;
    
    int arrayLength = (int)buffer.length;
    int len = sizeof(bs->buffer);
    
    if (stream->pos > arrayLength)
        stream->pos = arrayLength;
    if (stream->pos < 0)
        stream->pos = 0;
    if (len + stream->pos > arrayLength)
        len = arrayLength - stream->pos;
    
    stream->rp = bs->buffer;
    stream->wp = stream->rp + len;
    stream->pos += len;
    if (len == 0)
        return EOF;
    return *stream->rp++;
}

static void bufferStreamClose(fz_context *ctx, void *state) {
    fz_free(ctx, state);
}

static void bufferStreamSeek(fz_stream *stream, int offset, int whence) {
    int arrayLength = (int)buffer.length;
    
    if (whence == 0) /* SEEK_SET */
        stream->pos = offset;
    else if (whence == 1) /* SEEK_CUR */
        stream->pos += offset;
    else if (whence == 2) /* SEEK_END */
        stream->pos = arrayLength + offset;
    
    if (stream->pos > arrayLength)
        stream->pos = arrayLength;
    if (stream->pos < 0)
        stream->pos = 0;
    
    stream->wp = stream->rp;
}

@end
