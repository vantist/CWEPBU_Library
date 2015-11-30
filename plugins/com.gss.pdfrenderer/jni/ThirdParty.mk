LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

PDF_RENDERER_ROOT := ../../plugins/com.gss.pdfrenderer

LOCAL_C_INCLUDES := \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg \
	$(PDF_RENDERER_ROOT)/thirdparty/mujs \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/include \
	$(PDF_RENDERER_ROOT)/scripts/freetype \
	$(PDF_RENDERER_ROOT)/scripts/jpeg \
	$(PDF_RENDERER_ROOT)/scripts/openjpeg \

LOCAL_CFLAGS := \
	-DFT2_BUILD_LIBRARY -DDARWIN_NO_CARBON -DHAVE_STDINT_H \
	-DOPJ_HAVE_STDINT_H \
	'-DFT_CONFIG_MODULES_H="slimftmodules.h"' \
	'-DFT_CONFIG_OPTIONS_H="slimftoptions.h"'
ifdef NDK_PROFILER
LOCAL_CFLAGS += -pg -DNDK_PROFILER -O2
endif
ifdef MEMENTO
LOCAL_CFLAGS += -DMEMENTO -DMEMENTO_LEAKONLY
endif

LOCAL_MODULE := mupdfthirdparty
LOCAL_SRC_FILES := \
	$(PDF_RENDERER_ROOT)/thirdparty/mujs/one.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_arith.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_arith_iaid.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_arith_int.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_generic.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_halftone.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_huffman.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_image.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_metadata.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_mmr.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_page.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_refinement.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_segment.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_symbol_dict.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec/jbig2_text.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/bio.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/cidx_manager.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/cio.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/dwt.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/event.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/function_list.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/image.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/invert.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/j2k.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/jp2.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/mct.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/mqc.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/openjpeg.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/opj_clock.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/phix_manager.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/pi.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/ppix_manager.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/raw.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/t1.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/t1_generate_luts.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/t2.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/tcd.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/tgt.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/thix_manager.c \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg/tpix_manager.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jaricom.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jcomapi.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdapimin.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdapistd.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdarith.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdatadst.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdatasrc.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdcoefct.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdcolor.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jddctmgr.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdhuff.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdinput.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdmainct.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdmarker.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdmaster.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdmerge.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdpostct.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdsample.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jdtrans.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jerror.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jfdctflt.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jfdctfst.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jfdctint.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jidctflt.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jidctfst.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jidctint.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jmemmgr.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jquant1.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jquant2.c \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg/jutils.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/adler32.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/compress.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/crc32.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/deflate.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/inffast.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/inflate.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/inftrees.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/trees.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/uncompr.c \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib/zutil.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftbase.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftbbox.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftbitmap.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftgasp.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftglyph.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftinit.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftstroke.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftsynth.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftsystem.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/fttype1.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/base/ftxf86.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/cff/cff.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/cid/type1cid.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/psaux/psaux.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/pshinter/pshinter.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/psnames/psnames.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/raster/raster.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/smooth/smooth.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/sfnt/sfnt.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/truetype/truetype.c \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/src/type1/type1.c

LOCAL_SRC_FILES := $(addprefix ../, $(LOCAL_SRC_FILES))

include $(BUILD_STATIC_LIBRARY)
