var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'https://pokeapi.co/api/v1/');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.factory("PokedexService", ["$resource", "POKEAPI", function($resource, POKEAPI) {
    var url = POKEAPI + "pokedex/1";

    return $resource(url, null);

  }]);

pokeApp.factory("PokemonService", ["$resource", "POKEAPI", function($resource, POKEAPI) {
    var url = POKEAPI + "pokemon/:pokemonId";

    return $resource(url, {pokemonId: "@id"});

  }]);

  pokeApp.factory("PokemonSelectorService", ["$resource", "POKEAPI", function($resource, POKEAPI) {

        var factory = {
            // data : {},
            // setName: function (name) {
            //     factory.data.name = name;
            // },
            // setId: function (id) {
            //     factory.data.id = id;
            // },
            // get: function (){
            //     return factory.data;
            // }
        }

        var data =
        {
            Selected: ''
        };
    
    return {
        getSelected: function () {
            return data.Selected;
        },
        setSelected: function (selected) {
            data.Selected = selected;
        }
    };

  }]);

pokeApp.controller('PokedexController', ['$scope', '$log', "$http", "PokedexService", "PokemonSelectorService",
 function($scope, $log, $http, PokedexService, PokemonSelectorService) {

// pokeApp.controller('PokedexController', ['$scope', '$log', "$http", "POKEAPI",
//  function($scope, $log, $http, POKEAPI) {
    $scope.pokemons = [{
        "id": "1",
        "name": "Pikachu"
    },
    {
        "id": "2",
        "name": "Alakazam"
    },
    {
        "id": "3",
        "name": "Rondoudou"
    },
    {
        "id": "4",
        "name": "Metamorph"
    },
    {
        "id": "5",
        "name": "Sulfura"
    }];

    $scope.selectPokemon = {};

    $scope.$watch('selectPokemon', function (newValue, oldValue) {
        if (newValue !== oldValue) PokemonSelectorService.setSelected(newValue);
    });
    

    $scope.$log = $log;

    $scope.monPokedex1 = PokedexService.get();

    // Resolve the promised response
    $scope.monPokedex1.$promise.then(function(data){
        $scope.monPokedex = data;   // all pokedex

        $scope.pokemons = data.pokemon; // all pokemons in pokedex
        
        // console.log($scope.pokemons);
    });

   

/*
    $http({method:"GET", url: POKEAPI + "pokedex/1/"}).
        then(function(response) {
            $scope.status = response.status;
            $scope.monPokedex = response.data;

            console.log($scope.monPokedex);
            console.log($scope.monPokedex.pokemon);
            
        }, function(response) {
            $scope.monPokedex = response.data || 'Request failed';
            $scope.status = response.status;
            $scope.$log.error("Something wrong happens...");
        });
*/
}]);

pokeApp.controller('PokemonController', ['$scope', "PokemonService", "PokemonSelectorService",
function($scope, PokemonService,PokemonSelectorService) {
    // $scope.infoPokemon = PokemonService.get({pokemonId:43});

    function getPokemonId (pokemonURI) {
        var idPokemonInUriAPI =  pokemonURI.split("/");

        // -1 for index and -1 pour atteindre l'avant dernier 
        return idPokemonInUriAPI[idPokemonInUriAPI.length - 2];
    }

    $scope.$watch(function () { return PokemonSelectorService.getSelected(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.selectPokemon = newValue;
            $scope.selectPokemon.id = getPokemonId(newValue.resource_uri);

            $scope.infoPokemon = PokemonService.get({pokemonId:$scope.selectPokemon.id});
        }
    });

}]);

pokeApp.directive('pokedex', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'pokedex.html'
  };
});
