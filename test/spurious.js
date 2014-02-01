describe("Spurious", function(){
    var Spurious = require('../spurious.js');

    it('should ', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });

        var config = spurious.readFile();

        expect(config.entities.length).toEqual(1);
    });
});
