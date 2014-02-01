var assert = require('assert');

describe('Array', function(){
    describe('#indexOf', function(){
        it('should not find 5', function(){
            assert.equal(1, [1,2,3].indexOf(5));
        });
    });
});
