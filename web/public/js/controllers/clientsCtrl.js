angular.module("rfidplatform").controller("clientsCtrl", function($scope, clientService, config, clients){

	$scope.app = "Cadastrar clientess";
	$scope.webInfo = " Primeiro Protótipo - Rascunho";
	$scope.clients = clients.data;

	console.log($scope.clients);

	var accessError = function(data, status){

		if(status == 401){
			$scope.noaccess = "Sem autorização de acesso";
			return;
		}

		$scope.error = data;
	}

	$scope.addClient = function(client){

		clientService.saveClient(client).success(function(data, status){
			$scope.success = data;

			$scope.client.clientName = "";
				$scope.client.authSecret = "";
				$scope.client.description = "";

			$scope.clientForm.$setPristine();

			loadClients();
		}).error(accessError);
	};

	var loadClients = function(){

		console.log("Token: " + config.token);

		clientService.getClients().success(function(data, status){
			$scope.clients = data;
		}).error(accessError);
	}

	$scope.removerCliente = function(clients){
		$scope.clients = clients.filter(function(cl) {
			if(!cl.selecionado) return cl; 
			else{
				clientService.removeClient({params: cl}).success(function(data, status){
					$scope.removido = data;
				});
			}
		});
	};

	$scope.isClienteSelecionado = function(clientes){
		if(clientes)
			return clientes.some(function (cliente){
				return cliente.selecionado;
			});

		return false;
	};
});