describe("Faker spurious", function(){
    var Spurious = require('../lib/spurious');
    var spurious;

    beforeEach(function(){
        spurious = new Spurious({
            configFile: 'faker.spurious.yaml',
            configPath: 'test/'
        });
        
    });

    it('should populate Hierarchy with 25 random records', function(){
        expect(spurious.service.getAllRecords().Hierarchy.length).toEqual(25);        
    });
});
