var f = require('Faker');

function SpuriousService(){
}

SpuriousService.initialized = false;
SpuriousService.records = {};
SpuriousService.resourceDefinitions = {};

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
                        record[prop.name] = f[prop.faker.category][prop.faker.type]();                         
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
        SpuriousService.initialized = true;
    },

    addRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before adding a record.");
            return;
        }

        var resDef = SpuriousService.resourceDefinitions[req.params.resource];                

        if(!resDef){
            res.send(404, "Resource not found"); 
        } else if(resDef.methods.indexOf('post') === -1){
            res.send(405, "Method not allowed");
        } else{
            var record = req.body;

            record[resDef.pk] = resDef.nextId;
            resDef.nextId++;

            SpuriousService.records[req.params.resource].push(record);
            
            res.send(record);
        }
    },

    getRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }
        
        var resDef = SpuriousService.resourceDefinitions[req.params.resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('get') === -1){
            res.send(405, "Method not allowed");
        } else {
            var record = SpuriousService.records[req.params.resource].filter(function(r){
                return r[resDef.pk] === req.params.id;
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
        
        var resDef = SpuriousService.resourceDefinitions[req.params.resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('get') === -1){
            res.send(405, "Method not allowed");
        } else {
            res.send(SpuriousService.records[req.params.resource]);
        }
    },

    deleteRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }
        
        var resDef = SpuriousService.resourceDefinitions[req.params.resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('delete') === -1){
            res.send(405, "Method not allowed");
        } else {
            var i = SpuriousService.records[req.params.resource].map(function(r){
                return r[resDef.pk];
            }).indexOf(req.params.id);

            if(i !== -1){
                SpuriousService.records[req.params.resource].splice(i, 1);
                res.send(204, "Resource deleted");
            }
        }
    },

    updateRecord: function(req, res){
        if(!SpuriousService.initialized){
            console.error("You must initialize the service before retrieving a record.");
            return;
        }
        
        var resDef = SpuriousService.resourceDefinitions[req.params.resource];

        if(!resDef){
            res.send(404, "Resource not found");
        } else if(resDef.methods.indexOf('delete') === -1){
            res.send(405, "Method not allowed");
        } else {
            var records = SpuriousService.records[req.params.resource].filter(function(r){
                return r[resDef.pk] === req.params.id; 
            });

            if(records.length > 1){
                throw 'There is something amiss with your primary keys.  Apologies...';
            } else if(records.length === 0){
                res.send(404, "Not found"); 
            } else{
                records[0] = req.body;

                records[0][resDef.pk] = req.params.id;
                
                res.send(records[0]);
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
