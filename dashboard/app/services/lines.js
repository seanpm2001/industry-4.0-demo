/*
 * ******************************************************************************
 * Copyright (c) 2017 Red Hat, Inc. and others
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Red Hat Inc. - initial API and implementation
 *
 * ******************************************************************************
 */

'use strict';

angular.module('app')

.factory('Lines', ['$rootScope', '$location', '$http', '$q', 'APP_CONFIG', 'Notifications', function($rootScope, $location, $http, $q, APP_CONFIG, Notifications) {

	var factory = {},
		lines = [],
		configRestEndpoint = "http://" + APP_CONFIG.DASHBOARD_PROXY_HOSTNAME + '.' + $location.host().replace(/^.*?\.(.*)/g,"$1") + '/api/lines';


    factory.getLines = function() {
        return lines;
    };

    factory.getLinesForFacility = function(facility) {
        return lines.filter(function(line) {
            return line.currentFid === facility.fid;
        });
    };

    factory.reset = function() {

        // get config
        $http({
            method: 'GET',
            url: configRestEndpoint + "/"
        }).then(function (response) {
            lines = response.data;
            if ((lines == undefined) || (lines.constructor !== Array)) {
                Notifications.error("Error fetching Lines (invalid data). Reload to retry");
                return;
            }

            $rootScope.$broadcast('lines:updated');

        }, function err(response) {
            console.log(JSON.stringify(response));
            Notifications.error("Error fetching Lines Configuration from [" + response.config.url + "]. Reload to retry");
        });

    };

	factory.reset();

	return factory;
}]);
