WALL_WEIGHT = 0;

function Graph(grid) {
  if (grid && grid.length > 0){
    this.setNodos(grid);
  }
  this.setFuncaoCalculo('f');
  this.setAlgoritmo('manhattan');
}
Graph.prototype = {
  setNodos(grid){
    this.content = [];
    this.grid = [];
    for (var x = 0; x < grid.length; x++) {
      this.grid[x] = [];
      for (let y = 0; y < grid[x].length; y++) {
        this.grid[x].push(new GraphNode(x, y, grid[x][y])); 
      }
    }
  },
  setFuncaoCalculo(calculo){
    this.funcaoCalculo = function(nodo){
      return nodo[calculo];
    }
  },
  setAlgoritmo(algoritmo){
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    const heuristics = {
      'manhattan': (pos0, pos1) => {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
      },
      'euclidean': function(pos0, pos1) {
        var D = 1;
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return D * Math.sqrt(d1 * d1 + d2 * d2)
      },
      'diagonal': function(pos0, pos1) {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
      }
    };
    this.diagonal = algoritmo == 'diagonal';
    this.algoritmo = heuristics[algoritmo];
  },
  getNodosVizinhos(node) {
    var ret = [];
    var x = node.x;
    var y = node.y;
    var grid = this.grid;
  
    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }
  
    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }
  
    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }
  
    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }
  
    if (this.diagonal) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
      }
  
      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
      }
  
      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
      }
  
      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
      }
    }
    return ret;
  },
  push(nodo) {
    this.content.push(nodo);
    this.calcularPosicao(this.content.length - 1);
  },
  calcularPosicao(index) {
    const nodo = this.content[index];

    while (index > 0) {
      const parentN = ((index + 1) >> 1) - 1;
      const parentNodo = this.content[parentN];
      if (this.funcaoCalculo(nodo) < this.funcaoCalculo(parentNodo)) {
        this.content[parentN] = nodo;
        this.content[index] = parentNodo;
        index = parentN;
      } else {
        break;
      }
    }
  },
  pop() {
    var result = this.content[0];
    var end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(this.content[0]);
    }
    return result;
  },
  recalcularNodo(nodo) {
    this.calcularPosicao(this.content.indexOf(nodo));
  },
  bubbleUp(element) {
    var length = this.content.length;
    var elemScore = this.funcaoCalculo(element);
    let index = 0;
    while (true) {
      var child2N = (index + 1) << 1;
      var child1N = child2N - 1;
      var swap = null;
      let child1Score;
      if (child1N < length) {
        var child1 = this.content[child1N];
        child1Score = this.funcaoCalculo(child1);
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        var child2 = this.content[child2N];
        if (this.funcaoCalculo(child2) < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        this.content[index] = this.content[swap];
        this.content[swap] = element;
        index = swap;
      } else {
        break;
      }
    }
  },
  buscarCaminho(startNode, endNode){
    start.h = this.algoritmo(startNode, endNode);
    startNode.visited = true;
    this.push(startNode);
  
    while (this.content.length > 0) {

      let currentNode = this.pop();
      
      if (currentNode == endNode) {
        var path = [];
        while (currentNode) {
          path.unshift(currentNode);
          currentNode = currentNode.parent;
        }
        return path;
      }

      currentNode.closed = true;

      var vizinhos = this.getNodosVizinhos(currentNode);

      for (const vizinho of vizinhos) {
        
        if (vizinho.closed) {
          continue;
        }
        var gScore = currentNode.g + vizinho.getCost(currentNode);

        const nodoVisitado = vizinho.visited;

        if (!nodoVisitado || gScore < vizinho.g) {

          vizinho.visited = true;
          vizinho.parent = currentNode;
          vizinho.h = vizinho.h || this.algoritmo(vizinho, endNode);
          vizinho.g = gScore;
          vizinho.f = vizinho.g + vizinho.h;

          if (!nodoVisitado) {
            this.push(vizinho);
          } else {
            this.recalcularNodo(vizinho);
          }

        }
      }
    }
  }
};

function GraphNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.visited = false;
  this.closed = weight == WALL_WEIGHT;
  this.parent = null;
}
GraphNode.prototype = {
  getCost(fromNeighbor) {
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }
};