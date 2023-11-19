var app = angular.module('myApp', []);

app.controller('myController', function ($scope, $http) {
    $scope.nominaInfo = null;
    $scope.user = null;

    $scope.login = function () {
        // Busca al usuario en la colección "users" por el email proporcionado
        var usersRef = ref(database);
        get(usersRef).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var userData = childSnapshot.val();
                if (userData.email === $scope.email) {
                    // Si se encuentra el usuario, intenta iniciar sesión
                    signInWithEmailAndPassword(auth, userData.email, $scope.password)
                        .then(function (userCredential) {
                            $scope.user = userCredential.user;
                            $scope.loadNominaInfo();
                        })
                        .catch(function (error) {
                            console.error('Error de inicio de sesión:', error.message);
                        });
                }
            });
        });
    };

    $scope.logout = function () {
        signOut(auth).then(function () {
            $scope.user = null;
            $scope.nominaInfo = null;
        }).catch(function (error) {
            console.error('Error al cerrar sesión:', error.message);
        });
    };

    $scope.loadNominaInfo = function () {
        if ($scope.user) {
            var userId = $scope.user.uid;
            var nominaRef = ref(database, 'nomina/' + userId);

            get(nominaRef)
                .then(function (snapshot) {
                    $scope.$apply(function () {
                        $scope.nominaInfo = snapshot.val();
                    });
                })
                .catch(function (error) {
                    console.error('Error al cargar la información de nómina:', error.message);
                });
        }
    };

    $scope.downloadDesprendible = function () {
        console.log('Descargando desprendible de pago...');
    };
});
