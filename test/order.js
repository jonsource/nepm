var request = require('request')
var expect = require('chai').expect

describe("Order tests", function() {

    var session = '';
    var base_url = "http://localhost:3000"

    it('logs in', function(done) {
        request({method:'post', uri:base_url + '/login', followRedirect:false, form:{username:'krtek', password:'evilkrtek'}},
            function(error, response, body) {
                expect(response.statusCode).to.equal(302);
                expect(response.headers.location).to.equal('/profile');
                session = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
                done();
        });
    });

    it("returns something", function(done) {
        var product1 = [ {property: 'variants', id:1, children: [{property: 'options', id:1}]},
                         {property: 'variants', id:2, children: [{property: 'options', id:5}]} ];
        var product2 = [ {property: 'variants', id:1, children: [{property: 'options', id:2}]},
                         {property: 'variants', id:2, children: [{property: 'options', id:6}]} ];
        var data = {order:[{product_id: 1, description: product1}, {product_id: 2, description: product2}]};
        request({method:'post', uri: base_url + '/v1/create_order', headers:{cookie:'connect.sid='+session}, body: data, json: true}, function(error, response, body) {
            console.log('body', body);
            done();
        });
    });
});
