var spuriousservice = module.exports = function(opt){
};

spuriousservice.prototype = {
    records: {},
    resourceDefinitions: {},
    initialized: false,

    initService: function(cfg){
        for(var i = 0, ii = cfg.resources.length; i < ii; i++){
            var resource = cfg.resources[i];

            this.records[resource.name] = [];
            this.resourceDefinitions[resource.name] = {};

            this.resourceDefinitions[resource.name].properties = {};
            this.resourceDefinitions[resource.name].methods = resource.methods;
            var properties = this.resourceDefinitions[resource.name].properties;

            for(var j = 0, jj = resource.properties.length; j < jj; j++){
                var prop = resource.properties[j];
                properties[prop.name] = {};
                properties[prop.name].type = prop.type;
                properties[prop.name].pk = prop.pk;

                if(properties[prop.name].pk){
                    if(!this.resourceDefinitions[resource.name].pk){
                        this.resourceDefinitions[resource.name].pk = prop.name;
                    } else {
                        console.error('Only a single primary key can be defined for a resource');
                        this.resourceDefinitions = null;
                        return;
                    }

                    this.resourceDefinitions[resource.name].nextId = 1;
                }
            }
        }

        this.initialized = true;
    },

    addRecord: function(req, res){
        if(!this.initialized){
            console.error("You must initialize the service before adding a record.");
            return;
        }

        var resDef = this.resourceDefinitions[req.params.resource];                

        if(!resDef){
            res.send(404, "Resource not found"); 
        } else if(resDef.methods.indexOf('post') === -1){
            res.send(405, "Method not allowed");
        } else{
            var record = req.body;

            record[resDef.pk] = resDef.nextId;
            resDef.nextId++;

            this.records[req.params.resource].push(record);
            
            res.send(record);
        }
    }

};
