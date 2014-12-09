CLOSURE=../vendor/compiler.jar

all: build/graph.js

CLOSURE_READABLE=--formatting PRETTY_PRINT --debug

CLOSURE_SOURCE_MAP=\
		--source_map_format V3\
		--create_source_map

CLOSURE_FLAGS=\
		--compilation_level SIMPLE_OPTIMIZATIONS\
		--warning_level QUIET\
		--jscomp_off uselessCode\
		--use_types_for_optimization\
		--summary_detail_level 3\
		--language_in=ECMASCRIPT5


CORE_FILES=point.js line.js hexagon.js country.js map.js mapgenerator.js generic.js
VENDOR_FILES=../vendor/raphael.js

build/graph.js: src/*.js
	-ls -lh build/graph.js
	cd src &&\
	java -jar $(CLOSURE) \
		--js_output_file "../build/graph.js"\
		$(CLOSURE_SOURCE_MAP) ../build/graph.js.map\
		$(CLOSURE_FLAGS)\
		--js $(VENDOR_FILES)\
		--js $(CORE_FILES)\

	echo "//# sourceMappingURL=/build/graph.js.map" >> build/graph.js
	ls -lh build/graph.js

clean:
	rm -f build/*

run:
	python2 -m SimpleHTTPServer 2> /dev/null 
