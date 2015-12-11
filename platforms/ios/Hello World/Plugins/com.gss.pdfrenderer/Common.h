//
//  Common.h
//  MuPDFTest
//
//  Created by Zam-mbpr on 2015/3/5.
//
//

#ifndef MuPDF_Common_h
#define MuPDF_Common_h

#include "mupdf/fitz.h"
#include "dispatch/dispatch.h"

extern fz_context *ctx;
extern dispatch_queue_t queue;
extern float screenScale;

enum {
    // use at most 128M for resource cache
    ResourceCacheMaxSize = 128<<20	// use at most 128M for resource cache
};

typedef struct rect_list_s rect_list;

struct rect_list_s
{
    fz_rect rect;
    rect_list *next;
};

#endif
