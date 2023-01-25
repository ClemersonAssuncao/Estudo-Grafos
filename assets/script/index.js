const DEFAULT_WEIGHT = 2;
const BOARD_ITEMS = {
  'eraser' : {
    weight : DEFAULT_WEIGHT,
    icon_class : 'fa-solid fa-eraser'
  },
  'person' : {
    weight : 1,
    name : 'person',
    icon_class : 'fa-solid fa-person'
  },
  'target' : { 
    name : 'target',
    weight : 1,
    icon_class : 'fa-solid fa-location-dot'
  },
  'obstacles' : [
    { name : 'road', weight : 1, icon_class: 'fa-solid fa-road'},
    { name : 'small-plant', weight : 3, icon_class: 'fa-solid fa-seedling'},
    { name : 'tree', weight : 4, icon_class: 'fa-sharp fa-solid fa-tree'},
    { name : 'water', weight : 5, icon_class: 'fa-solid fa-water'},
    { name : 'house', weight : 6, icon_class: 'fa-solid fa-house'},
    { name : 'house-lock', weight : 7, icon_class: 'fa-solid fa-house-lock'},
    { name : 'mountain', weight : 8, icon_class: 'fa-solid fa-mountain'},
    { name : 'volcano', weight : 9, icon_class: 'fa-solid fa-volcano'},
    { name : 'block', weight : 0, icon_class: 'fa-regular fa-circle-xmark'}
  ]
}
function setObstacleActive(ev) {
  if (!ev.currentTarget.classList.contains('active')){
    document.querySelector('.btn-group-toggle .active').classList.remove('active');
    ev.currentTarget.classList.add('active');
  }
}
$(function() { 
  for (const obstacle of BOARD_ITEMS.obstacles) {
    const obstacleLabel = document.createElement('label');
    obstacleLabel.className = 'btn btn-secondary graph-btn-obstacles';
    obstacleLabel.addEventListener('click', setObstacleActive);
    obstacleLabel.innerHTML = `<input type="radio" name="options" id="${obstacle.name}" autocomplete="off"> 
                               <i class="fa-2x ${obstacle.icon_class}"></i>`;
    document.querySelector('#obstacles').appendChild(obstacleLabel);
  }

  this.graphBoard = new GraphBoard(document.getElementById('board'), options = {
    columns : 50, rows : 20, showDebug: false
  });

  this.graphBoard.setRandomPosition('person');
  this.graphBoard.setRandomPosition('target');
  
  document.getElementById('debugCheck').addEventListener('click', (check) =>{
    this.graphBoard.setVisibleDebug(check.currentTarget.checked);
  })
  document.getElementById('start').addEventListener('click', () => {
    this.graphBoard.search();
  });
  document.getElementsByName('heuristic').forEach(elemento => {
    elemento.addEventListener('click', (ev) => {
      this.graphBoard.graph.setAlgoritmo(ev.currentTarget.value);
    });
  });
  document.getElementById('limpar_tudo').addEventListener('click', () => {
    this.graphBoard.boardGrid.querySelectorAll(`div.column`).forEach( elemento => {
      this.graphBoard.clearPathElement(elemento);
      if (!['person','target'].includes(elemento.getAttribute('name'))){
        this.graphBoard.removeItem(elemento);
        if (document.getElementById('randomMap').checked){
          const calc = Math.floor(Math.random() * BOARD_ITEMS.obstacles.length) 
          if (calc != BOARD_ITEMS.obstacles.length-1){
            this.graphBoard.addItem(elemento,BOARD_ITEMS.obstacles[calc].name)
          }
        }
      }
    });
    this.graphBoard.setRandomPosition('person');
    this.graphBoard.setRandomPosition('target');
  });
  document.getElementsByName('valor').forEach(elemento => {
    elemento.addEventListener('click', (ev) => {
      this.graphBoard.graph.setFuncaoCalculo(ev.currentTarget.value);
    });
  })
});

function GraphBoard (boardGrid, options = { columns : 20, rows : 20, showDebug: false}) {
  
  this.debugElement = null;
  this.boardGrid = boardGrid;
  this.options  = options;
  this.totalWeight = 0;
  this.graph = new Graph();
  this.gridElementCells = [];
  this.init();
}

GraphBoard.prototype = {
  init(){
    this.debugElement = document.createElement('div');
    this.debugElement.classList = 'popover bs-popover-right position-absolute';
    this.debugElement.style.width = '400px'; 
    this.debugElement.style.left = '-100px';
    this.debugElement.style.top = '-155px';
    this.debugElement.innerHTML += `
      <div class="arrow" style="top: 34px;"></div>
      <h3 class="popover-header text-secondary">Posições e pesos</h3>
      <div class="popover-body">
        <ul>
          <li class='debug_H'>H:<span></span></li>
          <li class='debug_G'>G:<span></span></li>
          <li class='debug_F'>F:<span></span></li>
          <li class='debug_W font-weight-bold'>Total de custo:<span></span></li>
        </ul>
      </div>`;
    this.boardGrid.appendChild(this.debugElement);

    for (let indexRow = 0; indexRow < this.options.rows; indexRow++) {
      const row = document.createElement('div');
      this.gridElementCells[indexRow] = [];
      row.setAttribute('row', indexRow);
      row.className = 'row justify-content-center flex-nowrap';
      for (let indexCol = 0; indexCol < this.options.columns; indexCol++) {
        const col = document.createElement('div');
        this.gridElementCells[indexRow].push(col);
        col.setAttribute('col', indexCol);
        col.setAttribute('weight', DEFAULT_WEIGHT);
        col.className = 'border column d-flex justify-content-center align-items-center';
        
        col.addEventListener('click', (ev) => {
          this.addItem(ev.currentTarget);
        });
        col.addEventListener('mouseover', (ev) => {
          if (ev.buttons == 1 && ev.toElement){
            if (ev.toElement.classList.contains('column')){
              this.addItem(ev.toElement)
            }
          } else {
            this.showHideDebug(ev, true);
          }
        });
        col.addEventListener('mouseout', (ev) => {
          this.showHideDebug(ev,false);
        });
        row.appendChild(col);
      }
      this.boardGrid.appendChild(row);
    }
  },
  setVisibleDebug(show = false) {
    this.options.showDebug = show;
    this.boardGrid.classList.toggle('show-debug', show);
  },
  showError(title, message){
    const errorDialog = document.createElement('div');
    errorDialog.innerHTML = `
    <div class="position-absolute w-100 h-100" style="left:0; top:0; opacity: 0.2; background-color: black;"></div>
    <div class="card position-absolute alerta shadow">
        <h3 class="popover-header text-danger text-weight-bold"><i class="fa-solid fa-circle-exclamation"></i> ${title}</h3>
        <div class="popover-body"> ${message} </div>
    </div>`;
    errorDialog.addEventListener('click',() => {
      errorDialog.remove();
    })
    document.body.appendChild(errorDialog);
  },
  showHideDebug(evento, show = true){
    if (!this.options.showDebug) {
      return;
    }
    this.debugElement.classList.toggle('show', show);
    const posicaoAtual = evento.currentTarget.getBoundingClientRect();
    this.debugElement.style.transform = `translate(${posicaoAtual.left}px,${posicaoAtual.top-30}px)`;
    if (this.graph.grid && this.graph.grid.length == this.options.rows){
      const node = this.nodeFromElement(evento.currentTarget);
      this.debugElement.querySelector('.debug_F span').textContent = node.f;
      this.debugElement.querySelector('.debug_G span').textContent = node.g;
      this.debugElement.querySelector('.debug_H span').textContent = node.h;
      this.debugElement.querySelector('.debug_W  span').textContent = this.totalWeight;
    }
  },
  addItem(node, nameItem){
    const name = nameItem || document.querySelector('input[name="options"]:checked').id;
    let item = BOARD_ITEMS[name] || BOARD_ITEMS.obstacles.find( obj => obj.name == name);
    if (['target','person'].includes(name)){
      const elemento = this.boardGrid.querySelector(`.column[name=${name}]`);
      if (elemento){
        this.removeItem(elemento);
      }
    }
    if (name == 'eraser'){
      this.removeItem(node);
      return;
    }
    node.innerHTML = `<i class="${item.icon_class}"></i>`;
    node.setAttribute('weight', item.weight);
    node.setAttribute('name', item.name);
  },
  removeItem(node){
    if (node.firstChild && node.firstChild.remove());
    node.setAttribute('weight', DEFAULT_WEIGHT);
    node.removeAttribute('name');
  },
  setRandomPosition(nameItem){
    const position = this.boardGrid.querySelector(`.row[row="${Math.floor(Math.random() * this.options.rows)}"] .column[col="${Math.floor(Math.random() * this.options.columns)}"]`);
    this.addItem(position,nameItem);
  },
  getPersonElement() {
    return this.boardGrid.querySelector('.column[name="person"]');
  },
  getTargetElement() {
    return this.boardGrid.querySelector('.column[name="target"]');
  },
  nodeFromElement(element) { 
    return this.graph.grid[Number(element.parentElement.getAttribute('row'))][Number(element.getAttribute('col'))];
  },
  elementFromNode(node) {
    return this.gridElementCells[node.x][node.y];
  },
  isAbleToSearch(){
    return (this.boardGrid.querySelectorAll(`.column[name="person"],.column[name="target"]`).length == 2);
  },
  search(){
    if (this.isAbleToSearch()){
      const grid = [];
      this.totalWeight = 0;
      for (const indexRow in this.gridElementCells) {
        grid[indexRow] = [];
        for (const column of this.gridElementCells[indexRow]) {
          grid[indexRow].push(Number(column.getAttribute('weight')));
          this.clearPathElement(column);
        }
      } 
      this.graph.setNodos(grid);
      var path = this.graph.buscarCaminho(this.nodeFromElement(this.getPersonElement()) , this.nodeFromElement(this.getTargetElement()));
      this.mostrarCaminho(path);
    } else {
      this.showError('É necessário um ponto inicial e final',`Para que seja possível calcular um caminho é necessário um ponto inicial e final. <br> 
                                                             Inclua um personagem definido pelo ícone <i class="${BOARD_ITEMS.person.icon_class}"> </i>, 
                                                             e um alvo definido pelo ícone <i class="${BOARD_ITEMS.target.icon_class}"> </i> e tente novamente!`);
    }
  },
  clearPathElement(elemento){
    elemento.classList.remove('caminho');
    elemento.classList.remove('visited');
  },
  mostrarCaminho(path) {    
    if(!path) {
      this.showError('Não encontrado um caminho possível','Todos os caminhos possíveis para o personagem estão bloqueados por paredes. <br> Limpe alguns caminhos e tente novamente!');
    } else {

      var self = this;
      var addClass = function(path, i) {
          if(i >= path.length) {
              return;
          }
          self.elementFromNode(path[i]).classList.add('caminho');
          self.totalWeight += path[i].weight;
          setTimeout(function() {
              addClass(path, i+1);
          }, 50);
      };
      addClass(path, 0);
      for (const rowIt of this.graph.grid) {
        rowIt.filter(elemento => elemento.visited).forEach(nodo => {
          const nodeElement = this.elementFromNode(nodo);
          nodeElement.classList.add('visited');
        })
      }
    }
  }
}