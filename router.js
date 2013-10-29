/***
 * ROUTER.JS
 *
 * owner: Gage Peterson justgage@gmail.com
 *
 * licence -> MIT
 *
 * make_router
 *    returns an object with these functions
 *
 */
var Router = function (debug) {
    var log = function (text) {
        if (debug && console) {
            console.log(text);
        }
    };

    var err = function (text) {
        if (debug && console) {
            console.error(text);
        }
    };

    var hash_routes = [];
    var trigger_routes = [];

    var find = function (name, callback) {
        var route;
        var found = 0;
        // this is a booleen that checks if a callback was handed
        var fireable = typeof callback === "function";

        // If it's a hash route
        if (name[0] === '#') {

            //get the arguments after the slash
            args = name.slice(1).split("/").slice(1);
            
            /* 
             * get rid of everything after the slash
             * leaving just the name to check against
             */
            name = name.replace(/\/.*/g, ""); 

            /***
             * check each route if it matches and then hand it
             * to the function 'callback' if there's one
             * supplied. 
             */
            for (i = 0, l = hash_routes.length; i < l; i ++) {
                route = hash_routes[i];
                if ( name === route.name ) {
                    found++;
                    if (fireable) {
                        callback(route, hash_routes, i, args);
                    }
                }
            }

        } else { // it's a trigger route

            /***
             * check each route if it matches and then hand it
             * to the function 'callback' if there's one
             * supplied. 
             */
            for (i = 0, l = trigger_routes.length; i < l; i ++) {
                route = trigger_routes[i];
                if ( name === route.name ) {
                    found++;
                    if (fireable) {
                        callback(route, trigger_routes, i);
                    }
                }
            }
        }

        return found > 0; // Return if any where found
    };

    $(window).bind('hashchange', hashChangeFire);

    function hashChangeFire () {
        var hash = window.location.hash;
        log("hash change " + hash);
        var found = 0;
        var hash_array = hash.split("/");
        var i = 0;

        log(hash_array);

        for (i = 0, l = hash_routes.length; i < l; i ++) {
            var route = hash_routes[i];
            if (route.name === hash_array[0]) {
                for (i = 0, l = route.event.length; i < l; i ++) {
                    log(hash + " event Fired! (from hashchange)");
                    route.event[i](hash_array.slice(1));
                }
            }
        }
    }

    var returnOB = {
        hashCheck : hashChangeFire,
        add : function (route, callback) {
            if (typeof route === "string") {
                //is a hash route
                if (route[0] === "#") {
                    if (find(route) === false) {
                        if (typeof callback === 'function') {
                            err("ADDED : " + route + "\t\tWITH function");

                            hash_routes.push( { name: route , event : [callback] } );
                        } else {
                            err("ADDED : " + route + "\t\tNO function");
                            hash_routes.push( { name: route , event : [] } );
                        }
                    } else {
                        err("ERROR: route already exists, use listen -> route");
                        return  false;
                    }
                }

                // not a hash route
                else {
                    if (find(route) === false) {
                        if (typeof callback === 'function') {
                            trigger_routes.push( { name: route , event : [callback] } );
                        } else {
                            trigger_routes.push( { name: route , event : [] } );
                        }
                    } else {
                        err("ERROR: route already exists, use listen -> " + route);
                        return  false;
                    }
                }
                return  true;

                // bad input for route
            } else {
                log('ROUTE: bad input on add');
                log(route);
                log(callback);
                return false;
            }
        },
        //this will fire any event
        fire : function (route) {
            var trigger;
            var i = 0;
            var j = 0;

            log( 'FIRE: "' + route +  '"');

            var worked = find(route, function (route, list, j, args) {

                var hash_array = args;

                for (var i = 0, l = route.event.length; i < l; i ++) {
                    log("   " + i + ": event fired");
                    route.event[i](hash_array);
                }

                if (i === 0) {
                    log("   route " + route.name + ' has no listeners');
                } else {
                    if (route[0] === "#") {
                        window.location.hash = route;
                    }
                }
            });

            if (worked === false) {
                err('   fire failed: event not found!');
            }

            return worked;
        },
        // Add a listener to a tag
        listen : function (name , callback) {
            log(name + " has new listener");
            return find(name, function (route) {
                route.event.push(callback);
            });
        },
        // Remove a route and all it's listeners
        remove : function (name) {
            find(name, function (route, list, i) {
                log("route " + route + " was removed");
                list.splice(i, 1);
            });
        },
        hashUpdate : function(hash){
            window.location.hash = hash;
        },
        //show all the routes (error checking)
        show : function () {
            var i = 0;
            var v;

            log('hash_routes');
            if (hash_routes.length === 0) {
                log("   ~~no routes~~");
            }
            else {
                for (i = 0, l = hash_routes.length; i < l; i ++) {
                    log("   " + hash_routes[i].name + " [" + hash_routes[i].event.length + "]" );
                }
            }

            log('trigger_routes');
            if (trigger_routes.length === 0) {
                log("   ~~no routes~~");
            }
            else {
                for (i = 0, l = trigger_routes.length; i < l; i ++) {
                    log("   " + trigger_routes[i].name + " [" + trigger_routes[i].event.length + "]" );
                }
            }
        }
    };

    return returnOB;
};


