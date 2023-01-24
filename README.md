# Estudo-Grafos

Uma versão do código [javascript-astar](https://github.com/bgrins/javascript-astar). Esse estudo tem o objetivo de entender melhor o algoritmo de calculo de distancias em matrizes adjacentes.

## Testando o algoritmo

Não é necessário instalar dependencias, basta abrir o index.html.
Acima do grid apresentado na aplicação existe a barra de construção de obstáculos. Utilize os botões dessa barra para construir obstaculos e forçar o personagem a buscar a melhor rota possível. Por padrão cada quadrado vazio na matriz representa peso 2 e cada outro obstaculo possui as respectivos pesos:

* <img width="20" height="20" src='assets/media/road-solid.svg'> </img>: Representa peso 1, tornando o caminho mais facil;
* <img width="20" height="20" src='assets/media/seedling-solid.svg'> </img>: Representa peso 3;
* <img width="20" height="20" src='assets/media/tree-solid.svg'> </img>: Representa peso 4;
* <img width="20" height="20" src='assets/media/water-solid.svg'> </img>: Representa peso 5;
* <img width="20" height="20" src='assets/media/house-solid.svg'> </img>: Representa peso 6;
* <img width="20" height="20" src='assets/media/house-lock-solid.svg'> </img>: Representa peso 7;
* <img width="20" height="20" src='assets/media/mountain-solid.svg'> </img>: Representa peso 8;
* <img width="20" height="20" src='assets/media/volcano-solid.svg'> </img>: Representa peso 9;
* <img width="20" height="20" src='assets/media/circle-xmark-regular.svg'> </img>: Representa caminho bloqueado sem chance de passar;

Ao clicar sobre o botão verde <img width="20" height="20" src='assets/media/map-location-dot-solid.svg'> </img>  o código vai pegar o estado atual da matriz e traçar a rota do ponto inicial ao final. 

* O ícone de personagem <img width="20" height="20" src='assets/media/person-solid.svg'> </img> representa o ponto inicial;
* O ícone de localização <img width="20" height="20" src='assets/media/location-dot-solid.svg'> </img> representa o ponto final;

Só será possível incluir um único ponto inicial e um único ponto final.

Existem três [algoritmos heuristicos](http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html) disponíveis para seleção, manhattan ou diagonal ou euclidean. Cada algoritmo possui uma forma diferente traçar a rota para chegar ao ponto final. Também será possível selecionar o tipo de calculo para analisar os pesos. 

* Considerar H fará com que o algoritmo ignore os pesos, traçando o caminho de acordo com o algoritmo Heuristico selecionado, tornando esse tipo de calculo o mais rápido de execução e menor distancia, porém menos eficiente;
* Considerar G irá considerar o peso buscando o caminho mais eficiente, analisando um número maior de campos antes de definir o trajeto;
* Considerar F irá considerar o peso e o Heuristico, traçando um caminho analisando um menor numero de campos que o calculo G.

Marcar a opção "Mostrar Debug mostrará em azul os campos que foram analisados pelo algoritmo antes de traçar o caminho, e mostrará também em cada célula o valor que representa os tipos de calculo.

É possível limpar a matrix usando o botão <img width="20" height="20" src='assets/media/arrows-rotate-solid.svg'> </img>. Caso a opção "Gerar mapa aleatório" esteja marcada, ele irá incluir nas células diferentes obstáculos.

## Referencias

* [javascript-astar](https://github.com/bgrins/javascript-astar)
* [caminhominimo.pdf](https://www.ibilce.unesp.br/Home/Departamentos/MatematicaAplicada/docentes/socorro/caminhominimo.pdf)
* [heuristic](http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html)
