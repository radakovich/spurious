describe("Spurious service", function(){
    var Spurious = require('../spurious.js');
    var SpuriousService = require('../services/spuriousservice.js');
   
    it('should be initialized', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });
        
        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);
        
        expect(spuriousservice.records.Company).toBeDefined();
        expect(spuriousservice.records.Hierarchy).toBeDefined(); 
        expect(spuriousservice.records.Employee).toBeDefined();

        var compDef = spuriousservice.resourceDefinitions.Company;

        expect(compDef.properties.CompanySK.pk).toBeTruthy();
        expect(compDef.properties.CompanySK.type).toEqual('int');
        expect(compDef.properties.CompanyName.pk).toBeFalsy();
        expect(compDef.properties.CompanyName.type).toEqual('string');
        expect(compDef.methods.indexOf('get')).not.toEqual(-1);
        expect(compDef.methods.indexOf('post')).not.toEqual(-1);
        expect(compDef.methods.indexOf('put')).not.toEqual(-1);
        expect(compDef.methods.indexOf('delete')).not.toEqual(-1);

        var hierDef = spuriousservice.resourceDefinitions.Hierarchy;

        expect(hierDef.properties.HierarchySK.pk).toBeTruthy();
        expect(hierDef.properties.HierarchySK.type).toEqual('int');
        expect(hierDef.properties.Name.pk).toBeFalsy();
        expect(hierDef.properties.Name.type).toEqual('string');
        expect(hierDef.methods.indexOf('get')).not.toEqual(-1);
        expect(hierDef.methods.indexOf('post')).toEqual(-1);

        var empDef = spuriousservice.resourceDefinitions.Employee;

        expect(empDef.properties.EmployeeSK.pk).toBeTruthy();
        expect(empDef.properties.EmployeeSK.type).toEqual('int');
        expect(empDef.properties.FirstName.pk).toBeFalsy();
        expect(empDef.properties.FirstName.type).toEqual('string');
        expect(empDef.properties.LastName.pk).toBeFalsy();
        expect(empDef.properties.LastName.type).toEqual('string');
        expect(empDef.methods.indexOf('get')).not.toEqual(-1);
        expect(empDef.methods.indexOf('post')).toEqual(-1);
    });
});
