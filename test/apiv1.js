var request = require('request')
var expect = require('chai').expect

function test_route(base_url, expected) {
	describe(base_url, function() {
		for(url in expected) {
            var code = 200;
            var value = expected[url];
            if(Array.isArray(value)) {
                code = value[0];
                value = value[1];
            }
	    	it(url + " returns status "+code+" and matches expected value", function(done) {
	        	request(base_url+url, function(error, response, body) {
		            expect(response.statusCode).to.equal(200);
	    	        expect(body).to.equal(expected[url]);
	    			done();
	        	});
	    	});
	    }
	});
}

describe("Api v1 tests", function() {

    test_route('http://localhost:3000/v1/products',
    	{	'/': '[{"id":1,"parent_id":null,"price":10,"name":"t-shirt","description":"Obyčejné triko"},{"id":2,"parent_id":null,"price":25,"name":"trousers","description":"Obyčejné kalhoty"},{"id":3,"parent_id":null,"price":15,"name":"shirt","description":"Obyčejná košile"}]',
    		'/1': '[{"id":1,"name":"t-shirt"}]',
    		'/1?v': '[{"id":1,"parent_id":null,"price":10,"name":"t-shirt","description":"Obyčejné triko"},{"id":2,"parent_id":null,"price":25,"name":"trousers","description":"Obyčejné kalhoty"},{"id":3,"parent_id":null,"price":15,"name":"shirt","description":"Obyčejná košile"}]',
    		'/1?load=variants': '[{"id":1,"parent_id":null,"price":10,"name":"t-shirt","description":"Obyčejné triko"},{"id":2,"parent_id":null,"price":25,"name":"trousers","description":"Obyčejné kalhoty"},{"id":3,"parent_id":null,"price":15,"name":"shirt","description":"Obyčejná košile"}]',
    		'/1?load=variants.options': '[{"id":1,"parent_id":null,"price":10,"name":"t-shirt","description":"Obyčejné triko"},{"id":2,"parent_id":null,"price":25,"name":"trousers","description":"Obyčejné kalhoty"},{"id":3,"parent_id":null,"price":15,"name":"shirt","description":"Obyčejná košile"}]',
    });

    test_route('http://localhost:3000/v1/variants',
    	{	'/': '[{"id":1,"name":"velikost"},{"id":2,"name":"barva"}]',
            '?load=option':[400, '{"name":"ModelUnknownProperty","message":"Unknown property option of variant"}'],
    });

    test_route('http://localhost:3000/v1/options',
    	{	'/': '[{"id":1,"variant_id":1,"name":"s"},{"id":2,"variant_id":1,"name":"m"},{"id":3,"variant_id":1,"name":"l"},{"id":4,"variant_id":1,"name":"xl"},{"id":5,"variant_id":2,"name":"červená"},{"id":6,"variant_id":2,"name":"modrá"},{"id":7,"variant_id":2,"name":"bílá"}]',
    });
});
