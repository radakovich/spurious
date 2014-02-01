var fs = require('fs'),
    spuriousservice = require('./service');

var spurious = module.exports = function(opt){
    var self = this;

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
        this.service.initService(this.config);
    }
};

spurious.expressBind = function(app, opt){
        var sp = new spurious(opt);

        app.get('/:resource', sp.service.getRecords);
        app.get('/:resource/:id', sp.service.getRecord);
        app.post('/:resource', sp.service.addRecord);
        app.put('/:resource/:id', sp.service.updateRecord);
        app.delete('/:resource/:id', sp.service.deleteRecord);
};

spurious.prototype = {
    configFile: 'spurious.config.json',
    configPath: '',
    config: {},

    readFile: function(){
        return JSON.parse(fs.readFileSync(this.configPath + this.configFile, 'utf8')); 
    },
};

