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
            }
        }

        this.initialized = true;
    },

    addRecord: function(req, res){
        if(!this.initialized){
            console.error("You must initialize the service before adding a record.");
            return;
        }

         
    }

};
