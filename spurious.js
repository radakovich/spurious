var fs = require('fs'),
    path = require('path');

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
};

spurious.expressBind = function(app){

};

spurious.prototype = {
    configFile: 'spurious.config.json',
    configPath: '',
    config: {},

    readFile: function(){
        return JSON.parse(fs.readFileSync(this.configPath + this.configFile, 'utf8')); 
    }
};

