var fs = require('fs'),
    spuriousservice = require('./service');

var spurious = module.exports = function(opt){
    var self = this;

    if(opt.odataStyle){
        this.odataStyle = true;
    }

    if(opt.configFile){
        this.configFile = opt.configFile;
    }

    if(opt.configPath){
        this.configPath = opt.configPath;
    }

    try{
        this.config = this.readFile();
    } catch (e){
        console.log("There was a problem reading " + this.configPath + this.configFile);
    }
   
    if(this.config.resources){
        this.service = spuriousservice;
        
        if(this.odataStyle){
            this.config.odataStyle = true;
        }

        this.service.initService(this.config);
    }
};

spurious.expressBind = function(app, opt){
        var sp = new spurious(opt);
        var routeMatcherWithId = '/:resource/:id';
        var routeMatcherResourceOnly = '/:resource';

        if(sp.odataStyle){
            routeMatcherWithId = /^\/(\w+)\((\d+)\)$/;
            routeMatcherResourceOnly = /^\/(\w+)$/;
        }
        app.get(routeMatcherResourceOnly, sp.service.getRecords);
        app.get(routeMatcherWithId, sp.service.getRecord);
        app.post(routeMatcherResourceOnly, sp.service.addRecord);
        app.put(routeMatcherWithId, sp.service.updateRecord);
        app.delete(routeMatcherWithId, sp.service.deleteRecord);
};

spurious.prototype = {
    configFile: 'spurious.config.json',
    configPath: '',
    config: {},

    readFile: function(){
        return JSON.parse(fs.readFileSync(this.configPath + this.configFile, 'utf8')); 
    },
};

