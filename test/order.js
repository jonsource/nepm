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
        var p_id1 = 1;
        var p_id2 = 2;
        var product1 = [ {property: 'variants', id:1, children: [{property: 'options', id:1}]},
                         {property: 'variants', id:2, children: [{property: 'options', id:5}]} ];
        var product2 = [ {property: 'variants', id:1, children: [{property: 'options', id:2}]},
                         {property: 'variants', id:2, children: [{property: 'options', id:6}]} ];
        var data = {order:[{product_id: p_id1, description: product1}, {product_id: p_id2, description: product2}]};
        request({method:'post', uri: base_url + '/v1/create_order', headers:{cookie:'connect.sid='+session}, body: data, json: true}, function(error, response, body) {
            console.log('body', body);
            console.log('items.data.items', body.items.data.items);


            expect(response.statusCode).to.equal(200);
            expect(body.items.schema.table).to.equal('order');
            var order_id = body.items.data.id;
            
            expect(body.items.data.items.length).to.equal(2);

            var item = body.items.data.items[0];
            expect(item.schema.table).to.equal('order_item');
            expect(item.data.product_id).to.equal(p_id1);
            expect(item.data.order_id).to.equal(order_id);
            
            var option = item.data.options[0];
            console.log('option', option);
            expect(option.schema.table).to.equal('order_item_option');
            expect(option.data.order_item_id).to.equal(item.data.id);
            expect(option.data.variant_name).to.equal('barva');
            

            done();
        });
    });
});
