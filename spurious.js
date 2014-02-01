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
};

spurious.prototype = {
    configFile: 'spurious.config.json',
    configPath: '',

    readFile: function(){
        return JSON.parse(fs.readFileSync(this.configPath + this.configFile, 'utf8')); 
    }
};

