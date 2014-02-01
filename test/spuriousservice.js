describe("Spurious spurious", function(){
    var Spurious = require('../lib/spurious');
    var res, r, spurious;

    beforeEach(function(){
        res = {
            send: function(record){
                r = record;
            },
            getSend: function(){
                return r;
            }
        };

        spurious = new Spurious({
            configFile: 'test.spurious.config.json',
            configPath: 'test/'
        });
    });

    it('should be initialized', function(){
        expect(spurious.service.getAllRecords().Company).toBeDefined();
        expect(spurious.service.getAllRecords().Hierarchy).toBeDefined(); 
        expect(spurious.service.getAllRecords().Employee).toBeDefined();

        var compDef = spurious.service.getResourceDefs().Company;

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

        var hierDef = spurious.service.getResourceDefs().Hierarchy;

        expect(hierDef.pk).toEqual('HierarchySK');
        expect(hierDef.properties.HierarchySK.pk).toBeTruthy();
        expect(hierDef.properties.HierarchySK.type).toEqual('int');
        expect(hierDef.nextId).toEqual(1);
        expect(hierDef.properties.Name.pk).toBeFalsy();
        expect(hierDef.properties.Name.type).toEqual('string');
        expect(hierDef.methods.indexOf('get')).not.toEqual(-1);
        expect(hierDef.methods.indexOf('post')).toEqual(-1);

        var empDef = spurious.service.getResourceDefs().Employee;

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

    it('should add a single record', function(){
        var req = {
            params: {
                resource: 'Company'
            },
            body: {
                CompanySK: 0,
                CompanyName: 'JJ Corp'
            }
        };

        spurious.service.addRecord(req, res);
        
        expect(spurious.service.getAllRecords().Company.length).toEqual(1);
        expect(spurious.service.getAllRecords().Company[0].CompanyName).toEqual('JJ Corp');
        expect(spurious.service.getAllRecords().Company[0].CompanySK).toEqual(1);
        
        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(1);
        expect(sentRecord.CompanyName).toEqual('JJ Corp'); 
    });

    it('should add two records', function(){
        var req = {
            params: {
                resource: 'Company'
            },
            body: {
                CompanySK: 0,
                CompanyName: 'JJ Corp'
            }
        };

        spurious.service.addRecord(req, res);
        
        expect(spurious.service.getAllRecords().Company.length).toEqual(1);
        expect(spurious.service.getAllRecords().Company[0].CompanyName).toEqual('JJ Corp');
        expect(spurious.service.getAllRecords().Company[0].CompanySK).toEqual(1);
        
        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(1);
        expect(sentRecord.CompanyName).toEqual('JJ Corp');

        req.body.CompanyName = 'Second, LLC';

        spurious.service.addRecord(req, res);

        expect(spurious.service.getAllRecords().Company.length).toEqual(2);
        expect(spurious.service.getAllRecords().Company[1].CompanyName).toEqual('Second, LLC');
        expect(spurious.service.getAllRecords().Company[1].CompanySK).toEqual(2);
    });
    
    it('should return a 404 error', function(){
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

        spurious.service.addRecord(req, res);

        var response = res.getSend();

        expect(response.status).toEqual(404);
    });

    it('should return a 405 error', function(){
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

        spurious.service.addRecord(req, res);

        var response = res.getSend();

        expect(response.status).toEqual(405);
    });

    it('should add retrieve a single record', function(){
        var req = {
            params: {
                resource: 'Company'
            },
            body: {
                CompanySK: 0,
                CompanyName: 'JJ Corp'
            }
        };

        spurious.service.addRecord(req, res);
        
        req = {
            params: {
                resource: 'Company',
                id: 1
            }
        };

        spurious.service.getRecord(req, res);

        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(1);
        expect(sentRecord.CompanyName).toEqual('JJ Corp');
    });

    it('should retrieve each record in Company individually', function(){
        spurious.service.getAllRecords().Company.push({
            CompanySK: 42,
            CompanyName: 'Lyotard'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 69,
            CompanyName: 'Vergara'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 77,
            CompanyName: 'Neo'
        });

        req = {
            params: {
                resource: 'Company',
                id: 42
            }
        };

        spurious.service.getRecord(req, res);

        var sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(42);
        expect(sentRecord.CompanyName).toEqual('Lyotard');

        req.params.id = 77;

        spurious.service.getRecord(req, res);

        sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(77);
        expect(sentRecord.CompanyName).toEqual('Neo');

        req.params.id = 69;

        spurious.service.getRecord(req, res);

        sentRecord = res.getSend();

        expect(sentRecord.CompanySK).toEqual(69);
        expect(sentRecord.CompanyName).toEqual('Vergara');
    });

    it('should return a 404 error', function(){
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

        spurious.service.getRecord(req, res);

        var response = res.getSend();

        expect(response.status).toEqual(404);
    });
    
    it('should retrieve a list of Companies', function(){
        spurious.service.getAllRecords().Company.push({
            CompanySK: 42,
            CompanyName: 'Lyotard'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 69,
            CompanyName: 'Vergara'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 77,
            CompanyName: 'Neo'
        });

        req = {
            params: {
                resource: 'Company'
            }
        };

        spurious.service.getRecords(req, res);

        var sentRecords = res.getSend();

        expect(sentRecords.length).toEqual(3);
        
        for(var i = 0; i < 3; i++){
            switch(sentRecords[i].CompanySK){
                case 42:
                    expect(sentRecords[i].CompanyName).toEqual('Lyotard');
                    break;
                case 69:
                    expect(sentRecords[i].CompanyName).toEqual('Vergara');
                    break;
                case 77:
                    expect(sentRecords[i].CompanyName).toEqual('Neo');
                    break;
            }
        }
    });

    it('should delete a single Company', function(){
        spurious.service.getAllRecords().Company.push({
            CompanySK: 42,
            CompanyName: 'Lyotard'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 69,
            CompanyName: 'Vergara'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 77,
            CompanyName: 'Neo'
        });

        req = {
            params: {
                resource: 'Company',
                id: 69
            }
        };

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

        spurious.service.deleteRecord(req, res); 

        var response = res.getSend();

        expect(response.status).toEqual(204);
        expect(spurious.service.getAllRecords().Company.length).toEqual(2);
    });

    it('should update a single Company', function(){
        spurious.service.getAllRecords().Company.push({
            CompanySK: 42,
            CompanyName: 'Lyotard'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 69,
            CompanyName: 'Vergara'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 77,
            CompanyName: 'Neo'
        });

        req = {
            params: {
                resource: 'Company',
                id: 42
            },
            body: {
                CompanySK: 42,
                CompanyName: 'Win International'
            }
        };

        spurious.service.updateRecord(req, res);

        expect(res.getSend().CompanyName).toEqual('Win International');
        expect(spurious.service.getAllRecords().Company.length).toEqual(3);
    });

    it('should return 404', function(){
        spurious.service.getAllRecords().Company.push({
            CompanySK: 42,
            CompanyName: 'Lyotard'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 69,
            CompanyName: 'Vergara'
        });
        spurious.service.getAllRecords().Company.push({
            CompanySK: 77,
            CompanyName: 'Neo'
        });

        req = {
            params: {
                resource: 'Company',
                id: 99 
            },
            body: {
                CompanySK: 99,
                CompanyName: 'Faker'
            }
        };

        res = {
            send: function(status, message){
                s = status;
                m = message;
            },
            getSend: function(){
                return {status:s, message:m};
            }
        };

        spurious.service.updateRecord(req, res);

        expect(res.getSend().status).toEqual(404);
    });
});
