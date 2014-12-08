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
            pred = predecessors[pred];
        }
        return {path: path, distance: distances[destination]};
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

        return dijkstra(graph, x, destination, visited, distances, predecessors);
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

