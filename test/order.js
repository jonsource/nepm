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
        var data = {order:[{product_id: 1, variants: {1: 2, 2: 5}}, {product_id: 1, variants: {1: 2, 2: 4}}]};
        request({method:'post', uri: base_url + '/v1/create_order', headers:{cookie:'connect.sid='+session}, body: data, json: true}, function(error, response, body) {
            console.log(body);
            done();
        });
    });
});
