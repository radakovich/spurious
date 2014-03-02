var f = require('Faker');

function SpuriousService(){
}

SpuriousService.initialized = false;
SpuriousService.records = {};
SpuriousService.resourceDefinitions = {};
SpuriousService.odataStyle = false;

SpuriousService.generateRecords = function(cfg){
    for(var i = 0, ii = cfg.resources.length; i < ii; i++){
        var resource = cfg.resources[i];

        if(resource.generate){
            var count = resource.generate;

            for(var j = 0; j < count; j++){
                var record = {};

                for(var k = 0, kk = resource.properties.length; k < kk; k++){
                    var prop = resource.properties[k];

                    if(prop.pk){
                        record[prop.name] = SpuriousService.resourceDefinitions[resource.name].nextId;
                        SpuriousService.resourceDefinitions[resource.name].nextId++;
                    } else if(prop.faker && prop.faker.category && prop.faker.type){
                        if(prop.faker.count){
                            record[prop.name] = f[prop.faker.category][prop.faker.type](prop.faker.count);
                        } else {
                            record[prop.name] = f[prop.faker.category][prop.faker.type]();                         
                        }
                    } else {
                        break;
                    }
                }
                    
                SpuriousService.records[resource.name].push(record);                    
            }
        }
    }
};

SpuriousService.prototype = {
    initService: function(cfg){
        for(var i = 0, ii = cfg.resources.length; i < ii; i++){
            var resource = cfg.resources[i];

            SpuriousService.records[resource.name] = [];
            SpuriousService.resourceDefinitions[resource.name] = {};

            SpuriousService.resourceDefinitions[resource.name].properties = {};
            SpuriousService.resourceDefinitions[resource.name].methods = resource.methods;
            var properties = SpuriousService.resourceDefinitions[resource.name].properties;

            for(var j = 0, jj = resource.properties.length; j < jj; j++){
                var prop = resource.properties[j];
                properties[prop.name] = {};
                properties[prop.name].type = prop.type;
                properties[prop.name].pk = prop.pk;

                if(properties[prop.name].pk){
                    if(!SpuriousService.resourceDefinitions[resource.name].pk){
                        SpuriousService.resourceDefinitions[resource.name].pk = prop.name;
                    } else {
                        console.error('Only a single primary key can be defined for a resource');
                        SpuriousService.resourceDefinitions = null;
                        return;
                    }

                    SpuriousService.resourceDefinitions[resource.name].nextId = 1;
                }
            }
        }

        SpuriousService.generateRecords(cfg);

        if(cfg.odataStyle){
            SpuriousService.odataStyle = cfg.odataStyle;
        }

        SpuriousService.initialized = true;
    },

    addRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before adding a record.");
            return;
        }

        var resource = SpuriousService.odataStyle ? req.params[0] : req.params.resource;

        var resDef = SpuriousService.resourceDefinitions[resource];                

        if(!resDef){
            res.send(404, "Resource not found"); 
        } else if(resDef.methods.indexOf('post') === -1){
            res.send(405, "Method not allowed");
        } else{
            var record = req.body;

            record[resDef.pk] = resDef.nextId;
            resDef.nextId++;

            SpuriousService.records[resource].push(record);
            
            res.send(record);
        }
    },

    getRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }

        var resource = SpuriousService.odataStyle ? req.params[0] : req.params.resource;
        var id = SpuriousService.odataStyle ? req.params[1] : req.params.id;
        
        var resDef = SpuriousService.resourceDefinitions[resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('get') === -1){
            res.send(405, "Method not allowed");
        } else {
            var record = SpuriousService.records[resource].filter(function(r){
                return r[resDef.pk] === parseInt(id);
            });

            if(record.length > 1){
                throw 'Your primary keys are messed up.  Sorry...';
            }

            res.send(record[0]);
        }
    },

    getRecords: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }

        var resource = SpuriousService.odataStyle ? req.params[0] : req.params.resource;
        
        var resDef = SpuriousService.resourceDefinitions[resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('get') === -1){
            res.send(405, "Method not allowed");
        } else {
            res.send(SpuriousService.records[resource]);
        }
    },

    deleteRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }
        
        var resource = SpuriousService.odataStyle ? req.params[0] : req.params.resource;
        var id = SpuriousService.odataStyle ? req.params[1] : req.params.id;

        var resDef = SpuriousService.resourceDefinitions[resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('delete') === -1){
            res.send(405, "Method not allowed");
        } else {
            var i = SpuriousService.records[resource].map(function(r){
                return r[resDef.pk];
            }).indexOf(parseInt(id));

            if(i !== -1){
                SpuriousService.records[resource].splice(i, 1);
                res.send(204, "Resource deleted");
            } else {
                res.send(404, "Not found");
            }
        }
    },

    updateRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }

        var resource = SpuriousService.odataStyle ? req.params[0] : req.params.resource;
        var id = SpuriousService.odataStyle ? req.params[1] : req.params.id;
        
        var resDef = SpuriousService.resourceDefinitions[resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('delete') === -1){
            res.send(405, "Method not allowed");
        } else {
            var i = SpuriousService.records[resource].map(function(r){
                return r[resDef.pk];
            }).indexOf(parseInt(id));

            if(i === -1){
                res.send(404, "Not found"); 
            } else {
                SpuriousService.records[resource][i] = req.body;

                SpuriousService.records[resource][i][resDef.pk] = parseInt(id);
                
                res.send(SpuriousService.records[resource][i]);
            }
        }
    },

    getAllRecords: function(){
        return SpuriousService.records;
    },

    getResourceDefs: function(){
        return SpuriousService.resourceDefinitions;
    },

    clearRecords: function(){
        SpuriousService.records = {};
    },

    clearResourceDefs: function(){
        SpuriousService.resourceDefinitions = {};
    }
};

module.exports = new SpuriousService();
