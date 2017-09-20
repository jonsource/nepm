var Promise = require('bluebird');
var request = require('request');
var expect = require('chai').expect;

function test_route(base_url, expected, done) {
	    var exp=[];
        for (key in expected) {
            exp.push({url:key, val: expected[key]});
        }
        return Promise.map(exp, function(val) {
            var code = 200;
            var url = val.url;
            var value = val.val;
            if(Array.isArray(value)) {
                console.log('isarray');
                code = value[0];
                value = value[1];
            }
            it(url + " returns status "+code+" and matches expected value", function(done) {
                return request(base_url+url, function(error, response, body) {
		            /*console.log("url", url);
                    console.log("expected", value);
                    console.log("body", body);*/
                    expect(response.statusCode).to.equal(code);
                    expect(body).to.equal(value);
	    			done();
	        	});
	    	});
	    });
}

describe("Api v1 tests", function() {

    test_route('http://localhost:3000/v1/products',
    	{	'/': '[{"id":1,"parent_id":null,"price":10,"name":"t-shirt","description":"Obyčejné triko"},{"id":2,"parent_id":null,"price":25,"name":"trousers","description":"Obyčejné kalhoty"},{"id":3,"parent_id":null,"price":15,"name":"shirt","description":"Obyčejná košile"}]',
    		'/1': '[{"id":1,"parent_id":null,"price":12,"name":"t-shirt","description":"Obyčejné triko"}]',
    		'/1?v': '[{"schema":{"table":"product","name":"product","plural":"products","joins":{"tags":{"multi":true,"source":"product","target":"tag","intermediate":"`product_has_tag`"},"options":{"multi":true,"source":"product","target":"option","intermediate":"`product_has_option`"},"variants":{"multi":true,"source":"product","target":"variant","intermediate":"`product_has_variant`"}}},"data":{"id":1,"parent_id":null,"price":12,"name":"t-shirt","description":"Obyčejné triko","deleted":0}}]',
    		'/1?load=variants': '[{"id":1,"parent_id":null,"price":12,"name":"t-shirt","description":"Obyčejné triko","variants":[{"schema":{"table":"variant","name":"variant","plural":"variants","joins":{"options":{"multi":true,"source":"product","target":"option","intermediate":"`product_has_option`"}}},"data":{"product_id":1,"variant_id":1,"deleted":0,"id":1,"name":"velikost"}},{"schema":{"table":"variant","name":"variant","plural":"variants","joins":{"options":{"multi":true,"source":"product","target":"option","intermediate":"`product_has_option`"}}},"data":{"product_id":1,"variant_id":2,"deleted":0,"id":2,"name":"barva"}}]}]',
    		'/1?load=variants.options': '[{"id":1,"parent_id":null,"price":12,"name":"t-shirt","description":"Obyčejné triko","variants":[{"schema":{"table":"variant","name":"variant","plural":"variants","joins":{"options":{"multi":true,"source":"product","target":"option","intermediate":"`product_has_option`"}}},"data":{"product_id":1,"variant_id":1,"deleted":0,"id":1,"name":"velikost","options":[{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":1,"product_id":1,"option_id":1,"price":0,"deleted":0,"variant_id":1,"name":"s"}},{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":2,"product_id":1,"option_id":2,"price":0,"deleted":0,"variant_id":1,"name":"m"}},{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":3,"product_id":1,"option_id":3,"price":1,"deleted":0,"variant_id":1,"name":"l"}},{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":4,"product_id":1,"option_id":4,"price":1,"deleted":0,"variant_id":1,"name":"xl"}}]}},{"schema":{"table":"variant","name":"variant","plural":"variants","joins":{"options":{"multi":true,"source":"product","target":"option","intermediate":"`product_has_option`"}}},"data":{"product_id":1,"variant_id":2,"deleted":0,"id":2,"name":"barva","options":[{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":5,"product_id":1,"option_id":5,"price":0,"deleted":0,"variant_id":2,"name":"červená"}},{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":6,"product_id":1,"option_id":6,"price":0,"deleted":0,"variant_id":2,"name":"modrá"}},{"schema":{"table":"option","name":"option","plural":"options","joins":{}},"data":{"id":7,"product_id":1,"option_id":7,"price":0,"deleted":0,"variant_id":2,"name":"bílá"}}]}}]}]',
    });

    test_route('http://localhost:3000/v1/variants',
    	{	'/': '[{"id":1,"name":"velikost"},{"id":2,"name":"barva"}]',
            '?load=option':[404, '{"name":"ModelUnknownProperty","message":"Unknown property option of model variant"}'],
    });

    test_route('http://localhost:3000/v1/options',
    	{	'/': '[{"id":1,"variant_id":1,"name":"s"},{"id":2,"variant_id":1,"name":"m"},{"id":3,"variant_id":1,"name":"l"},{"id":4,"variant_id":1,"name":"xl"},{"id":5,"variant_id":2,"name":"červená"},{"id":6,"variant_id":2,"name":"modrá"},{"id":7,"variant_id":2,"name":"bílá"}]',
    });
});
