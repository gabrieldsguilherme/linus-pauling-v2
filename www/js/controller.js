var linus = angular.module('linus', []);

linus.controller('CalculoController', ['$scope', function($scope) {

	$scope.informacao = 'A tabela de linus pauling aceita somente um número de elétrons entre 1 e 112! :)'
	$scope.ordemEnergetica = ' ';
	$scope.ordemGeometrica = ' ';
	$scope.eletronsPorCamada = ' ';
	$scope.subnivelMaisEnergetico = ' ';
	$scope.camadaDeValencia = ' ';

	$scope.$watch('eletrons', function(newValue, oldValue) {
		if (newValue > 0 && newValue < 113) {
			calcular(newValue);
		}
	});

	calcular = function(eletrons) {
        let elementos = getElementos();
        let ordemEnergetica = '';
        let ordemGeometrica = [];
        let ordemGeometricaFormatada = '';
        let eletronsPorCamada = inicializaEletronsPorCamada();
        let eletronsParaAdicionarNaCamada = 0;
        let eletronsPorCamadaFormatado = '';
        let subnivelMaisEnergetico = '';
        let camadaValencia = '';

        let i = 0;
        let total = 0;

        while (eletrons > total) {
            let elemento = '';
            elemento += elementos[i][0] + elementos[i][1];

            if (eletrons > total + elementos[i][2]) {
                elemento += elementos[i][2];
                ordemEnergetica += elemento + ', ';
            } else {
                elemento += eletrons - total;
                ordemEnergetica += elemento;
                ordemGeometrica[elemento.charAt(0) - 1] = getElementoParaCamada(ordemGeometrica, elemento);
                eletronsParaAdicionarNaCamada = getEletronsParaAdicionarNaCamada(elemento);
                eletronsPorCamada[elemento.charAt(0) - 1] += eletronsParaAdicionarNaCamada;
                subnivelMaisEnergetico = 'Subnível ' + elemento + '.';
                break;
            }

            ordemGeometrica[elemento.charAt(0) - 1] = getElementoParaCamada(ordemGeometrica, elemento) + ' ';

            eletronsParaAdicionarNaCamada = getEletronsParaAdicionarNaCamada(elemento);

            eletronsPorCamada[elemento.charAt(0) - 1] += eletronsParaAdicionarNaCamada;

            total += elementos[i][2];
            i++;
        }

        ordemGeometricaFormatada = formatarENomearCamadas(ordemGeometrica);
        eletronsPorCamadaFormatado = getEletronsPorCamada(eletronsPorCamada);
        camadaValencia = getUltimaCamada(eletronsPorCamada);

		$scope.calculos = {
			"calculos": [
				{
					"titulo": "Ordem Energética",
					"valor": ordemEnergetica
				},
				{
					"titulo": "Ordem Geométrica",
					"valor": ordemGeometricaFormatada
				},
				{
					"titulo": "Elétrons por Camada",
					"valor": eletronsPorCamadaFormatado
				},
				{
					"titulo": "Subnível Mais Energético",
					"valor": subnivelMaisEnergetico
				},
				{
					"titulo": "Camada de Valência",
					"valor": camadaValencia
				}
			]
		}
	}

	function getElementos() {
	    return [
	        [1, 's', 2],
	        [2, 's', 2],
	        [2, 'p', 6],
	        [3, 's', 2],
	        [3, 'p', 6],
	        [4, 's', 2],
	        [3, 'd', 10],
	        [4, 'p', 6],
	        [5, 's', 2],
	        [4, 'd', 10],
	        [5, 'p', 6],
	        [6, 's', 2],
	        [4, 'f', 14],
	        [5, 'd', 10],
	        [6, 'p', 6],
	        [7, 's', 2],
	        [5, 'f', 14],
	        [6, 'd', 10]
	    ];
	}

	function inicializaEletronsPorCamada() {
	    return [0, 0, 0, 0, 0, 0, 0];
	}

	function getElementoParaCamada(ordemGeometrica, elemento) {
	    if (ordemGeometrica[elemento.charAt(0) - 1] === undefined) {
	        return elemento;
	    } else {
	        return ordemGeometrica[elemento.charAt(0) - 1] + elemento;
	    }
	}

	function getEletronsParaAdicionarNaCamada(elemento) {
	    if (elemento.charAt(3) === "") {
	        return Number(elemento.charAt(2));
	    }
	    return Number(String(elemento.charAt(2) + elemento.charAt(3)));
	}

	function formatarENomearCamadas(ordemGeometrica) {
	    let ordemGeometricaFormatada = '';
	    let nomesCamadas = getNomesCamadas();
	    for (let i = 0; i < ordemGeometrica.length; i++) {
	        ordemGeometricaFormatada += nomesCamadas[i] + ': ' + ordemGeometrica[i];
	        if (i + 1 < ordemGeometrica.length) {
	            ordemGeometricaFormatada += ' | ';
	        }
	    }
	    return ordemGeometricaFormatada;
	}

	function getNomesCamadas() {
	    return ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
	}

	function getEletronsPorCamada(eletronsPorCamada) {
	    let eletronsPorCamadaFormatado = '';
	    for (let i = 0; i < eletronsPorCamada.length; i++) {
	        if (eletronsPorCamada[i] > 0) {
	            eletronsPorCamadaFormatado += getNomesCamadas()[i] + ': ' + eletronsPorCamada[i];
	            if (eletronsPorCamada[i+1] > 0) {
	                eletronsPorCamadaFormatado += ' | ';
	            }
	        } else {
	            break;
	        }
	    }
	    return eletronsPorCamadaFormatado;
	}

	function getUltimaCamada(eletronsPorCamada) {
	    for (let i = 0; i < eletronsPorCamada.length; i++) {
	        if (eletronsPorCamada[i] == 0) {
	            return 'Camada ' + getNomesCamadas()[i-1] + '.';
	        } else if (i + 1 >= eletronsPorCamada.length) {
	            return 'Camada ' + getNomesCamadas()[i] + '.';
	        }
	    }
	}
	
}]);