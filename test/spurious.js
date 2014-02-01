describe("Spurious", function(){
    var Spurious = require('../lib/spurious');

    it('should read the test file', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });

        expect(spurious.config.resources.length).toEqual(3);
    });
    
    it('should not find the config file', function(){
        var spurious = new Spurious({
            configFile: 'incorrect.json',
            configPath: 'wrong/path/'
        });
        
        expect(Object.getOwnPropertyNames(spurious.config).length).toEqual(0);
    });

});
