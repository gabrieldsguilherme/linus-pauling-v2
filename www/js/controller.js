var linus = angular.module('linus');

const MIN_VALUE = 1;
const MAX_VALUE = 118;

const SHARP = 's';
const PRINCIPAL = 'p';
const DIFFUSE = 'd'
const FUNDAMENTAL = 'f';

linus.controller('CalculoController', ['$scope', function($scope) {
	$scope.informacao = 'O diagrama de Linus Pauling trabalha com os elementos da tabela periódica que vão de 1 à 118, do Hidrogênio ao Ununóctio'

	$scope.$watch('numeroAtomico', function(newValue, oldValue) {
		if (newValue >= MIN_VALUE && newValue <= MAX_VALUE) {
			calcular(newValue);
		} else {
			$scope.calculos = '';
		}
	});

	calcular = function(numeroAtomico) {
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

        while (numeroAtomico > total) {
            let elemento = '';
            elemento += elementos[i][0] + elementos[i][1];

            if (numeroAtomico > total + elementos[i][2]) {
                elemento += elementos[i][2];
                ordemEnergetica += elemento + ', ';
            } else {
                elemento += numeroAtomico - total;
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
	        [1, SHARP, 2],
	        [2, SHARP, 2],
	        [2, PRINCIPAL, 6],
	        [3, SHARP, 2],
	        [3, PRINCIPAL, 6],
	        [4, SHARP, 2],
	        [3, DIFFUSE, 10],
	        [4, PRINCIPAL, 6],
	        [5, SHARP, 2],
	        [4, DIFFUSE, 10],
	        [5, PRINCIPAL, 6],
	        [6, SHARP, 2],
	        [4, FUNDAMENTAL, 14],
	        [5, DIFFUSE, 10],
	        [6, PRINCIPAL, 6],
	        [7, SHARP, 2],
	        [5, FUNDAMENTAL, 14],
	        [6, DIFFUSE, 10],
	        [7, PRINCIPAL, 6]
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