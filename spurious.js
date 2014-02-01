var fs = require('fs'),
    SpuriousService = require('./services/spuriousservice.js');

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
        this.spuriousservice = new SpuriousService();
        this.spuriousservice.initService(this.config);
    }
};

spurious.prototype = {
    configFile: 'spurious.config.json',
    configPath: '',
    config: {},

    readFile: function(){
        return JSON.parse(fs.readFileSync(this.configPath + this.configFile, 'utf8')); 
    },

    expressBind: function(app){
        app.get('/:resource', this.spuriousservice.getRecords);
        app.get('/:resource/:id', this.spuriousservice.getRecord);
        app.post('/:resource', this.spuriousservice.addRecord);
        app.put('/:resource/:id', this.spuriousservice.updateRecord);
        app.delete('/:resource/:id', this.spuriousservice.deleteRecord);
    }
};

