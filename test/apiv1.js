var request = require('request')
var expect = require('chai').expect

function test_route(base_url, expected) {
	describe(base_url, function() {
		for(url in expected) {
	    	it(url + " returns status 200 and matches expected value", function(done) {
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
    	{	'/': '{"products":[{"id":1,"name":"t-shirt"},{"id":2,"name":"trousers"},{"id":3,"name":"shirt"}]}',
    		'/1': '{"products":[{"id":1,"name":"t-shirt"}]}',
    		'/1?v': '{"products":[{"schema":{"table":"product","name":"product","plural":"products","joins":{"tags":{"multi":true,"source":"product","target":"tag","intermediate":"product_has_tag"},"options":{"multi":true,"source":"product","target":"option","intermediate":"product_has_option"},"variants":{"multi":true,"source":"product","target":"variant","intermediate":"product_has_variant"}}},"data":{"id":1,"parent_id":null,"price":10,"name":"t-shirt","descirption":"Obyčejné triko"}}]}',
    		'/1?load=variants': '{"products":[{"id":1,"name":"t-shirt","variants":[{"id":1,"name":"velikost"},{"id":2,"name":"barva"}]}]}',
    		'/1?load=variants.options': '{"products":[{"id":1,"name":"t-shirt","variants":[{"id":1,"name":"velikost","options":[{"id":1,"name":"s"},{"id":2,"name":"m"},{"id":3,"name":"l"},{"id":4,"name":"xl"}]},{"id":2,"name":"barva","options":[{"id":5,"name":"červená"},{"id":6,"name":"modrá"},{"id":7,"name":"bílá"}]}]}]}',
    });

    test_route('http://localhost:3000/v1/variants',
    	{	'/': '{"variants":[{"id":1,"name":"velikost"},{"id":2,"name":"barva"}]}',
    });

    test_route('http://localhost:3000/v1/options',
    	{	'/': '{"options":[{"id":1,"name":"s"},{"id":2,"name":"m"},{"id":3,"name":"l"},{"id":4,"name":"xl"},{"id":5,"name":"červená"},{"id":6,"name":"modrá"},{"id":7,"name":"bílá"}]}',
    });
});
