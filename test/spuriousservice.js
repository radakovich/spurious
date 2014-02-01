describe("Spurious service", function(){
    var Spurious = require('../spurious.js');
    var SpuriousService = require('../services/spuriousservice.js');
    var res, r;

    beforeEach(function(){
        res = {
            send: function(record){
                r = record;
            },
            getSend: function(){
                return r;
            }
        };

    });
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

        expect(compDef.pk).toEqual('CompanySK');
        expect(compDef.properties.CompanySK.pk).toBeTruthy();
        expect(compDef.properties.CompanySK.type).toEqual('int');
        expect(compDef.nextId).toEqual(1);
        expect(compDef.properties.CompanyName.pk).toBeFalsy();
        expect(compDef.properties.CompanyName.type).toEqual('string');
        expect(compDef.methods.indexOf('get')).not.toEqual(-1);
        expect(compDef.methods.indexOf('post')).not.toEqual(-1);
        expect(compDef.methods.indexOf('put')).not.toEqual(-1);
        expect(compDef.methods.indexOf('delete')).not.toEqual(-1);

        var hierDef = spuriousservice.resourceDefinitions.Hierarchy;

        expect(hierDef.pk).toEqual('HierarchySK');
        expect(hierDef.properties.HierarchySK.pk).toBeTruthy();
        expect(hierDef.properties.HierarchySK.type).toEqual('int');
        expect(hierDef.nextId).toEqual(1);
        expect(hierDef.properties.Name.pk).toBeFalsy();
        expect(hierDef.properties.Name.type).toEqual('string');
        expect(hierDef.methods.indexOf('get')).not.toEqual(-1);
        expect(hierDef.methods.indexOf('post')).toEqual(-1);

        var empDef = spuriousservice.resourceDefinitions.Employee;

        expect(empDef.pk).toEqual('EmployeeSK');
        expect(empDef.properties.EmployeeSK.pk).toBeTruthy();
        expect(empDef.properties.EmployeeSK.type).toEqual('int');
        expect(empDef.nextId).toEqual(1);
        expect(empDef.properties.FirstName.pk).toBeFalsy();
        expect(empDef.properties.FirstName.type).toEqual('string');
        expect(empDef.properties.LastName.pk).toBeFalsy();
        expect(empDef.properties.LastName.type).toEqual('string');
        expect(empDef.methods.indexOf('get')).not.toEqual(-1);
        expect(empDef.methods.indexOf('post')).toEqual(-1);
    });

    it('should be not initialized because of multiple primary keys', function(){
        var spurious = new Spurious({
            configFile: 'mpk.test.spurious.config.json',
            configPath: 'test/'
        });
        
        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);

        expect(spuriousservice.resourceDefinitions).toBeNull();
    });

    it('should add a single record', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });
        
        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);

        var req = {
            params: {
                resource: 'Company'
            },
            body: {
                CompanySK: 0,
                CompanyName: 'JJ Corp'
            }
        };

        spuriousservice.addRecord(req, res);
        
        expect(spuriousservice.records.Company.length).toEqual(1);
        expect(spuriousservice.records.Company[0].CompanyName).toEqual('JJ Corp');
        expect(spuriousservice.records.Company[0].CompanySK).toEqual(1);
        
        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(1);
        expect(sentRecord.CompanyName).toEqual('JJ Corp');
    });

    it('should add two records', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });
        
        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);

        var req = {
            params: {
                resource: 'Company'
            },
            body: {
                CompanySK: 0,
                CompanyName: 'JJ Corp'
            }
        };

        spuriousservice.addRecord(req, res);
        
        expect(spuriousservice.records.Company.length).toEqual(1);
        expect(spuriousservice.records.Company[0].CompanyName).toEqual('JJ Corp');
        expect(spuriousservice.records.Company[0].CompanySK).toEqual(1);
        
        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(1);
        expect(sentRecord.CompanyName).toEqual('JJ Corp');

        req.body.CompanyName = 'Second, LLC';

        spuriousservice.addRecord(req, res);

        expect(spuriousservice.records.Company.length).toEqual(2);
        expect(spuriousservice.records.Company[1].CompanyName).toEqual('Second, LLC');
        expect(spuriousservice.records.Company[1].CompanySK).toEqual(2);
    });
    
    it('should return a 404 error', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });

        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);

        res = {
            send: function(status, message){
                s = status;
                m = message;
                return;
            },
            getSend: function(){
                return {status: s, message: m};
            }
        };

        var req = {
            params: {
                resource: 'Derrida'
            },
            body: {
                firstName: 'Jacques',
                same: 'defer'
            }
        };

        spuriousservice.addRecord(req, res);

        var response = res.getSend();

        expect(response.status).toEqual(404);
    });

    it('should return a 405 error', function(){
        var spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });

        var spuriousservice = new SpuriousService();

        spuriousservice.initService(spurious.config);

        res = {
            send: function(status, message){
                s = status;
                m = message;
                return;
            },
            getSend: function(){
                return {status: s, message: m};
            }
        };

        var req = {
            params: {
                resource: 'Hierarchy'
            },
            body: {
            }
        };

        spuriousservice.addRecord(req, res);

        var response = res.getSend();

        expect(response.status).toEqual(405);
    });
});
