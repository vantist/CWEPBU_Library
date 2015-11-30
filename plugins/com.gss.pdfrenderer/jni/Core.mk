LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

PDF_RENDERER_ROOT := ../../plugins/com.gss.pdfrenderer

ifeq ($(TARGET_ARCH),arm)
LOCAL_CFLAGS += -DARCH_ARM -DARCH_THUMB -DARCH_ARM_CAN_LOAD_UNALIGNED
ifdef NDK_PROFILER
LOCAL_CFLAGS += -pg -DNDK_PROFILER
endif
endif
LOCAL_CFLAGS += -DAA_BITS=8
ifdef MEMENTO
LOCAL_CFLAGS += -DMEMENTO -DMEMENTO_LEAKONLY
endif
ifdef SSL_BUILD
LOCAL_CFLAGS += -DHAVE_OPENSSL
endif

LOCAL_C_INCLUDES := \
	$(PDF_RENDERER_ROOT)/thirdparty/jbig2dec \
	$(PDF_RENDERER_ROOT)/thirdparty/openjpeg/libopenjpeg \
	$(PDF_RENDERER_ROOT)/thirdparty/jpeg \
	$(PDF_RENDERER_ROOT)/thirdparty/mujs \
	$(PDF_RENDERER_ROOT)/thirdparty/zlib \
	$(PDF_RENDERER_ROOT)/thirdparty/freetype/include \
	$(PDF_RENDERER_ROOT)/source/fitz \
	$(PDF_RENDERER_ROOT)/source/pdf \
	$(PDF_RENDERER_ROOT)/source/xps \
	$(PDF_RENDERER_ROOT)/source/cbz \
	$(PDF_RENDERER_ROOT)/source/img \
	$(PDF_RENDERER_ROOT)/source/tiff \
	$(PDF_RENDERER_ROOT)/scripts/freetype \
	$(PDF_RENDERER_ROOT)/scripts/jpeg \
	$(PDF_RENDERER_ROOT)/scripts/openjpeg \
	$(PDF_RENDERER_ROOT)/generated \
	$(PDF_RENDERER_ROOT)/resources \
	$(PDF_RENDERER_ROOT)/include \
	$(PDF_RENDERER_ROOT)
ifdef V8_BUILD
LOCAL_C_INCLUDES += $(PDF_RENDERER_ROOT)/thirdparty/$(V8)/include
endif
ifdef SSL_BUILD
LOCAL_C_INCLUDES += $(PDF_RENDERER_ROOT)/thirdparty/openssl/include
endif

LOCAL_MODULE    := mupdfcore
LOCAL_SRC_FILES := \
	$(wildcard $(PDF_RENDERER_ROOT)/source/fitz/*.c) \
	$(wildcard $(PDF_RENDERER_ROOT)/source/pdf/*.c) \
	$(wildcard $(PDF_RENDERER_ROOT)/source/xps/*.c) \
	$(wildcard $(PDF_RENDERER_ROOT)/source/cbz/*.c) \
	$(wildcard $(PDF_RENDERER_ROOT)/source/img/*.c) \
	$(wildcard $(PDF_RENDERER_ROOT)/source/tiff/*.c)
LOCAL_SRC_FILES += \
	$(PDF_RENDERER_ROOT)/source/pdf/js/pdf-js.c \
	$(PDF_RENDERER_ROOT)/source/pdf/js/pdf-jsimp-mu.c
ifdef MEMENTO
LOCAL_SRC_FILES += $(PDF_RENDERER_ROOT)/source/fitz/memento.c
endif

LOCAL_LDLIBS    := -lm -llog -ljnigraphics

LOCAL_SRC_FILES := $(addprefix ../, $(LOCAL_SRC_FILES))

include $(BUILD_STATIC_LIBRARY)
