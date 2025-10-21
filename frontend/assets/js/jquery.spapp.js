(function($) {
    
    $.spapp = function(settings) {
        var config = {
            'defaultView'  : 'home',
            'templateDir'  : './pages/',
            'pageNotFound' : false
        };
        
        if(settings) $.extend(config, settings);
        
        var app = {
            routes: {},
            currentView: null,
            
            route: function(route, view, load, onCreate, onReady) {
                this.routes[route] = {
                    view: view,
                    load: load || null,
                    onCreate: onCreate || null,
                    onReady: onReady || null
                };
                return this;
            },
            
            run: function(defaultRoute) {
                var self = this;
                defaultRoute = defaultRoute || config.defaultView;
                
                $(window).on('hashchange', function() {
                    self.loadView();
                });
                
                if(window.location.hash) {
                    self.loadView();
                } else {
                    window.location.hash = '#' + defaultRoute;
                }
            },
            
            loadView: function() {
                var hash = window.location.hash.substring(1);
                var route = this.routes[hash];
                
                if(!route && config.pageNotFound) {
                    hash = config.pageNotFound;
                    route = this.routes[hash];
                }
                
                if(!route) {
                    console.error('Route not found:', hash);
                    return;
                }
                
                this.currentView = hash;
                
                if(typeof route.onCreate === 'function') {
                    route.onCreate();
                }
                
                if(route.view) {
                    var self = this;
                    var templatePath = config.templateDir + route.view + '.html';
                    
                    $.get(templatePath, function(data) {
                        $('#spapp').html(data);
                        
                        if(typeof route.onReady === 'function') {
                            route.onReady();
                        }
                        
                        if(typeof route.load === 'function') {
                            route.load();
                        }
                    }).fail(function() {
                        console.error('Failed to load template:', templatePath);
                    });
                }
            },
            
            navigateTo: function(route) {
                window.location.hash = '#' + route;
            }
        };
        
        return app;
    };
    
})(jQuery);
