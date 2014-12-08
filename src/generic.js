/*var dijkstra = function (adjacency, source, target) {
    "use strict";

    var dist = [],
        sptSet = [],
        previous = [],
        i = 0,
        minDistance = function () {
            var min = Number.MAX_VALUE,
                min_index,
                v = 0;
            for (v = 0; v < adjacency.length; v += 1) {
                if (sptSet[v] === false && dist[v] < min) {
                    min = dist[v];
                    min_index = v;
                }
            }

            return min_index;
        };

    for (i = 0; i < adjacency.length; i += 1) {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
        previous[i] = [];
    }

    dist[source] = 0;

    for (i = 0; i < adjacency.length; i += 1) {
        var u = minDistance(),
            v;

        sptSet[u] = true;

        for (v = 0; v < adjacency.length; v+= 1) {
            if (!sptSet[v] &&                               // If it isnt already visited
                 adjacency[u][v] &&                         // If there IS a path
                 dist[u] !== Number.MAX_VALUE &&            // If it isn't infinite.
                 dist[u] + adjacency[u][v] < dist[v]) {     // Distance to this is less. THEN:
                dist[v] = dist[u] + adjacency[u][v];
                previous[i][v] = u;
            }
        }
    }

    var Path = [];

    console.log(previous);
    
    for (i = 0; i < adjacency.length; i += 1) {
        for (var j = 0; j < previous[i].length; j += 1) {
            if (previous[i][j])
                console.log(previous[i][j]);
        }
    }

    return dist;
};

Object.length = function(obj) {
    "use strict";
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};*/

function dijkstra (graph, source, destination, visited, distances, predecessors) {
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

    if (source === destination) {
        // We build the shortest path and display it here.
        var path = [];
        var pred = destination;
        while (pred !== undefined) {
            path.push(pred);
            pred = predecessors.pred;
            console.log(predecessors);
        }
        console.log("Result",path, "Distance", distances[destination]);
    } else {
        if (visited.length === 0) {
            // Initial run
            distances[source] = 0;
        }


        for (var i = 0; i < Object.keys(graph[source]).length; i += 1) {
            var neighbour = Object.keys(graph[source])[i];
            if (!visited.contains(neighbour)) {
                var new_distance = distances[source] + graph[source][neighbour];
                if (new_distance < (distances[neighbour] === undefined ? Number.MAX_VALUE : distances[neighbour])) {
                    distances[neighbour] = new_distance;
                    predecessors[neighbour] = source;
                }
            }
        }

        visited.push(source);

        var unvisited = {}

        for (var i = 0; i < Object.keys(graph).length; i += 1) {
            var k = Object.keys(graph)[i];
            if (!visited.contains(k)) {
                unvisited[k] = distances[k] ? distances[k] : Number.MAX_VALUE;
            }
        }

        var arr = Object.keys( unvisited ).map(function ( key ) { return unvisited[key]; });
        var x = Object.keys(unvisited).filter(function(key) {return unvisited[key] === Math.min.apply( null, arr )})[0];

        //console.log("ored", predecessors);

        dijkstra(graph, x, destination, visited, distances, predecessors);
    }
};

graph = {
      's': {
        'a': 2,
        'b': 1},
      'a': {
        's': 3,
        'b': 4,
        'c':8},
      'b': {
        's':4,
        'a': 2,
        'd': 2},
      'c': {
        'a': 2,
        'd': 7,
        't': 4},
      'd': {
        'b': 1,
        'c': 11,
        't': 5},
      't': {
        'c': 3,
        'd': 5}};

dijkstra(graph, 's', 'd');