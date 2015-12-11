//
//  PDFRendererCore.m
//  mupdf
//
//  Created by Zam-mbpr on 2015/3/3.
//
//

#import <Foundation/Foundation.h>
#include "mupdf/fitz.h"
#include "mupdf/pdf.h"
#include "dispatch/dispatch.h"
#import "PDFRendererCore.h"
//#import "mach/mach.h"
//
//vm_size_t usedMemory(void) {
//    struct task_basic_info info;
//    mach_msg_type_number_t size = sizeof(info);
//    kern_return_t kerr = task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)&info, &size);
//    return (kerr == KERN_SUCCESS) ? info.resident_size : 0; // size in bytes
//}
//
//vm_size_t freeMemory(void) {
//    mach_port_t host_port = mach_host_self();
//    mach_msg_type_number_t host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
//    vm_size_t pagesize;
//    vm_statistics_data_t vm_stat;
//    
//    host_page_size(host_port, &pagesize);
//    (void) host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size);
//    return vm_stat.free_count * pagesize;
//}
//
//void logMemUsage(void) {
//    // compute memory usage and log if different by >= 100k
//    static long prevMemUsage = 0;
//    long curMemUsage = usedMemory();
//    long memUsageDiff = curMemUsage - prevMemUsage;
//    
//    if (memUsageDiff > 100000 || memUsageDiff < -100000) {
//        prevMemUsage = curMemUsage;
//        NSLog(@"Memory used %7.1f MB(%+5.0f), free %7.1f MB", curMemUsage/8000000.0f, memUsageDiff/1000.0f, freeMemory()/8000000.0f);
//    }
//}

@implementation PDFRendererCore

- (id) init {
    [super self];
    queue = dispatch_queue_create("com.gss.mupdf.queue", nil);
    return self;
}

- (void) dealloc {
    [self closeFile];
}

/**
 * --------------------
 * public method
 * --------------------
 */
- (BOOL) openFile: (char*)path {
    ctx = fz_new_context(nil, nil, ResourceCacheMaxSize);
    fz_register_document_handlers(ctx);
    dispatch_sync(queue, ^{});
    docRef = [[MuDocRef alloc] initWithFilename: path];
    return docRef != nil;
}

- (BOOL) openFile: (NSData*)buffer magic: (char*)magic {
    ctx = fz_new_context(nil, nil, ResourceCacheMaxSize);
    fz_register_document_handlers(ctx);
    dispatch_sync(queue, ^{});
    docRef = [[MuDocRef alloc] initWithBuffer: buffer magic: magic];
    return docRef != nil;
}

- (void) closeFile {
    dispatch_sync(queue, ^{});
    if (pageList) {
        fz_drop_display_list(ctx, pageList);
        pageList = nil;
    }
    if (page) {
        fz_free_page(docRef->doc, page);
        page = nil;
    }
    if (docRef) {
        fz_close_document(docRef->doc);
        docRef->doc = nil;
        docRef = nil;
    }
    if (ctx) {
        fz_free_context(ctx);
        ctx = nil;
    }
}

- (NSInteger) countPages {
    __block NSInteger pages = 0;
    dispatch_sync(queue, ^{
        fz_try(ctx) {
            pages = fz_count_pages(docRef->doc);
        } fz_catch(ctx) {
            printf("Failed to find page number");
        }
    });
    return pages;
}

- (CGSize) getPageSize: (int)index {
    __block CGSize size = { 0.0, 0.0 };
    dispatch_sync(queue, ^{
        fz_page* aPage = [self getPage: index];
        fz_try(ctx) {
            fz_rect bounds;
            fz_bound_page(docRef->doc, aPage, &bounds);
            size.width = bounds.x1 - bounds.x0;
            size.height = bounds.y1 - bounds.y0;
        } fz_catch(ctx) {
            printf("Failed to find page bounds\n");
        }
    });
    return size;
}

- (BOOL) needsPassword {
    dispatch_sync(queue, ^{});
    return fz_needs_password(docRef->doc);
}

- (BOOL) authenticatePassword: (char*)password {
    dispatch_sync(queue, ^{});
    return fz_authenticate_password(docRef->doc, password);
}

- (BOOL) isFileOpen {
    dispatch_sync(queue, ^{});
    return ctx != nil && [self countPages] > 0;
}

- (UIImage*) drawPage: (int)index pageSize: (CGSize)pageSize patchRect: (CGRect)patchRect {
    if (index < 0) {
        index = 0;
    } else if (index >= [self countPages]) {
        index = [self countPages] - 1;
    }
    __block UIImage* image = nil;
    __block CGDataProviderRef imageData = nil;
    fz_pixmap* pixmap = nil;
    
    [self ensureDisplaylists: index];
    pixmap = [self renderPixmap:index pageSize: pageSize patchRect: patchRect];
    dispatch_sync(queue, ^{
        CGDataProviderRelease(imageData);
        imageData = [self createWrappedPixmap: pixmap];
        image = [self newImageWithPixmap: pixmap imageData: imageData];
    });
//    logMemUsage();
    return image;
}

/**
 * --------------------
 * private method
 * --------------------
 */
// load fz_page
- (fz_page*) getPage: (int)index {
    fz_page* aPage = nil;
    fz_try(ctx) {
        aPage = fz_load_page(docRef->doc, index);
    } fz_catch(ctx) {
        printf("Failed to load page\n");
    }
    return aPage;
}

// make sure page will be loaded
- (void) ensurePageLoaded: (int)index {
    dispatch_sync(queue, ^{
        fz_try(ctx) {
            fz_rect bounds;
            if (page) {
                fz_free_page(docRef->doc, page);
                page = nil;
            }
            page = [self getPage: index];
            fz_bound_page(docRef->doc, page, &bounds);
        } fz_catch(ctx) {
            printf("no page had been loaded\n");
        }
    });
}

// make sure page display list will be loaded
- (void) ensureDisplaylists: (int)index {
    dispatch_sync(queue, ^{});
    [self ensurePageLoaded: index];
    if (!page)
        return;
    dispatch_sync(queue, ^{
        if (pageList) {
            fz_drop_display_list(ctx, pageList);
            pageList = nil;
        }
        [self createPageList: page];
    });
}

// create page content
- (void) createPageList: (fz_page*)aPage {
    fz_device *dev = nil;
    fz_var(dev);
    fz_var(pageList);
    fz_try(ctx) {
        pageList = fz_new_display_list(ctx);
        dev = fz_new_list_device(ctx, pageList);
        fz_run_page_contents(docRef->doc, aPage, dev, &fz_identity, nil);
    } fz_always(ctx) {
        fz_free_device(dev);
        dev = nil;
    } fz_catch(ctx) {
        printf("Fail to create page contents.\n");
    }
}

static void releasePixmap(void *info, const void *data, size_t size) {
    if (queue) {
        dispatch_async(queue, ^{
            fz_drop_pixmap(ctx, info);
        });
    } else {
        fz_drop_pixmap(ctx, info);
    }
}

- (CGDataProviderRef) createWrappedPixmap: (fz_pixmap*)pix {
    unsigned char *samples = fz_pixmap_samples(ctx, pix);
    int w = fz_pixmap_width(ctx, pix);
    int h = fz_pixmap_height(ctx, pix);
    return CGDataProviderCreateWithData(pix, samples, w * 4 * h, releasePixmap);
}

- (CGImageRef) createCGImageWithPixmap: (fz_pixmap*)pix data: (CGDataProviderRef)cgdata {
    int w = fz_pixmap_width(ctx, pix);
    int h = fz_pixmap_height(ctx, pix);
    CGColorSpaceRef cgcolor = CGColorSpaceCreateDeviceRGB();
    CGImageRef cgimage = CGImageCreate(w, h, 8, 32, 4 * w, cgcolor, kCGBitmapByteOrderDefault, cgdata, nil, NO, kCGRenderingIntentDefault);
    CGColorSpaceRelease(cgcolor);
    return cgimage;
}

- (UIImage*) newImageWithPixmap: (fz_pixmap*)pix imageData: (CGDataProviderRef)cgdata {
    CGImageRef cgimage = [self createCGImageWithPixmap: pix data: cgdata];
    UIImage *image = [[UIImage alloc] initWithCGImage: cgimage scale: screenScale orientation: UIImageOrientationUp];
    CGImageRelease(cgimage);
    CGDataProviderRelease(cgdata);
    return image;
}

// render page content to pixmap
- (fz_pixmap*) renderPixmap:(int)index pageSize: (CGSize)pageSize patchRect: (CGRect)patchRect {
    __block fz_device *dev = nil;
    __block fz_pixmap *pix = nil;
    fz_irect bbox;
    fz_rect rect;
    fz_matrix ctm;
    
    bbox.x0 = patchRect.origin.x;
    bbox.y0 = patchRect.origin.y;
    bbox.x1 = patchRect.origin.x + patchRect.size.width;
    bbox.y1 = patchRect.origin.y + patchRect.size.height;
    CGSize size = [self getPageSize:index];
    float sx = pageSize.width / size.width;
    float sy = pageSize.height / size.height;
    fz_scale(&ctm, sx, sy);
    fz_rect_from_irect(&rect, &bbox);
    dispatch_sync(queue, ^{
        fz_var(dev);
        fz_var(pix);
        fz_try(ctx) {
            pix = fz_new_pixmap_with_bbox(ctx, fz_device_rgb(ctx), &bbox);
            fz_clear_pixmap_with_value(ctx, pix, 255);
            dev = fz_new_draw_device(ctx, pix);
            if (pageList) {
                fz_run_display_list(pageList, dev, &ctm, &rect, nil);
            }
        } fz_always(ctx) {
            fz_free_device(dev);
            dev = nil;
        } fz_catch(ctx) {
            fz_drop_pixmap(ctx, pix);
        }
    });
    return pix;
}

@end