var map,
    paper = Raphael("paper"),
    button = document.getElementById('generate'),
    maps = [],
    origin,
    end,
    width = document.documentElement.clientWidth - 200,
    height = document.documentElement.clientHeight - 40;

function getParameterByName(name) {
    "use strict";
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? 26 : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function generate () {
    "use strict";

    paper.clear();
    paper.setSize(width, height);
    Raphael.getColor.reset();
    try {
        var generator = new MapGenerator();
        
        generator.createHexagonPattern(
            width,
            height,
            25,
            false
        );
        
        generator.generate(
            parseInt(getParameterByName('countries')),
            0.6,
            false
        );
        
        map = generator.getMap();
        
        for (var i = 0; i < map.regions.length; i++) {          
            maps.push(paper.path(map.regions[i].pathString).attr("fill", /*'#C0E8AD'); /*/Raphael.getColor(0)));
            /*
            maps[i].node.onmouseover = function() {
                this.setAttribute("oldfill", this.getAttribute("fill"));
                var fill = this.getAttribute("fill");

                this.setAttribute("fill", "#165196");
            };
            maps[i].node.onmouseout = function() {
                this.setAttribute("fill", this.getAttribute("oldfill"));
            };
            */

            maps[i].node.setAttribute("data-id", i);
            maps[i].node.setAttribute("class", maps[i].node.getAttribute("class") + " effect");

            maps[i].node.onclick = function() {
                var Num = String.fromCharCode(Number(this.getAttribute("data-id")) + 65);

                this.setAttribute("class", this.getAttribute("class") + " effect-persisting");

                if (!origin) origin = Num;
                else {
                    end = Num;
                    findRoute(origin, end);
                    origin = undefined;
                    end = undefined;
                }
            };
        }
        
        for (var i = 0; i < map.adjacencyMatrix.length; i++) {
            for (var j = 0; j < i; j++) {
                if (map.adjacencyMatrix[i][j] != 0) {
                    var x1 = map.regions[i].center.x,
                        y1 = map.regions[i].center.y,
                        x2 = map.regions[j].center.x,
                        y2 = map.regions[j].center.y;
                    paper.path(
                        'M ' + x1 + 
                        ',' + y1 + 
                        ' L ' + x2 + 
                        ',' + y2 + ' Z'
                    ).attr({'stroke': '#ffffff', 'stroke-width': 5, 'opacity': 0.4});

                    paper.text((x1+x2)/2, (y1+y2)/2, map.adjacencyMatrix[i][j].toFixed(2));
                }

            }
            var x = map.regions[i].center.x,
                y = map.regions[i].center.y;
            paper.circle(x, y, 10).attr("fill", '#F9F5ED');
            paper.text(x, y, String.fromCharCode(i + 65));
        } 
    } catch(e) {
        //WHY EVEN BOTHER! 
        alert(e);
    }
}

function dijkstra(graph, source, destination, visited, distances, predecessors) {
    "use strict";
    if (!visited) {
        visited = [];
    }
    if (!distances) {
        distances = {};
    }
    if (!predecessors) {
        predecessors = {};
    }

    var i = 0,
        unvisited = {},
        neighbour,
        new_distance,
        path = [],
        pred = destination,
        k,
        arr,
        new_source;

    if (source === destination) {
        // We build the shortest path and display it here.
        while (pred !== undefined) {
            path.push(pred);
            pred = predecessors[pred];
        }
        return {path: path, distance: distances[destination]};
    }

    if (visited.length === 0) {
        // Initial run
        distances[source] = 0;
    }

    for (i = 0; i < Object.keys(graph[source]).length; i += 1) {
        neighbour = Object.keys(graph[source])[i];
        if (!visited.contains(neighbour)) {
            new_distance = distances[source] + graph[source][neighbour];
            if (new_distance < (distances[neighbour] === undefined ? Number.MAX_VALUE : distances[neighbour])) {
                distances[neighbour] = new_distance;
                predecessors[neighbour] = source;
            }
        }
    }

    visited.push(source);

    for (i = 0; i < Object.keys(graph).length; i += 1) {
        k = Object.keys(graph)[i];
        if (!visited.contains(k)) {
            unvisited[k] = distances[k] || Number.MAX_VALUE;
        }
    }

    arr = Object.keys(unvisited).map(function (key) {
        return unvisited[key];
    });
    new_source = Object.keys(unvisited).filter(function (key) {
        return unvisited[key] === Math.min.apply(null, arr);
    })[0];

    return dijkstra(graph, new_source, destination, visited, distances, predecessors);
}

function translateGraphFromAdjacency(adjacency) {
    "use strict";
    var Graph = {},
        i = 0,
        j = 0;

    for (i = 0; i < adjacency.length; i += 1) {
        Graph[String.fromCharCode(i + 65)] = {};
        for (j = 0; j < adjacency[i].length; j += 1) {
            if (adjacency[i][j]) {
                Graph[String.fromCharCode(i + 65)][String.fromCharCode(j + 65)] = adjacency[i][j];
            }
        }
    }
    return Graph;
}

function findRoute(source, destination) {
    "use strict";
    var _graph = translateGraphFromAdjacency(map.adjacencyMatrix),
        path = dijkstra(_graph, source, destination);

    traceRoute(path.path);
    return path
}

function traceRoute(path) {
    var i = 0,
        x,
        y,
        x1,
        y1,
        x2,
        y2;

    for (i = 0; i < path.length - 1; i += 1) {
        x = path[i].charCodeAt() - 65;
        y = path[i + 1].charCodeAt() - 65;
        x1 = map.regions[x].center.x;
        y1 = map.regions[x].center.y;
        x2 = map.regions[y].center.x;
        y2 = map.regions[y].center.y;

        paper.path(
            'M ' + x1 + 
            ',' + y1 + 
            ' L ' + x2 + 
            ',' + y2 + ' Z'
        ).attr({'stroke': '#000000', 'stroke-width': 5, 'opacity': 0.8});
    }
}

generate();