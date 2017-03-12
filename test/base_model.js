var expect = require('chai').expect;
var BaseModel = require('../models/base_model');
var Product = require('../models/product');

describe("Base model test", function() {

	it('Creates a base model object', function() {
    	var bm = new BaseModel();
    	expect(bm).to.be.not.null;
    	
    })
});

describe("Product test", function() {

	var p;
	it('Creates a product object', function(done) {
    	p = new Product();
    	expect(p).to.be.not.null;
    	done();
    })    

	it('Gets a product instance', function(done) {
    	p.findOneBy('id', 1)
		.then(function(i) {
			expect(i).to.be.not.null;
			done();
		});
    })

    it('Get instance and lazy load variants', function(done) {
    	var instance;
    	p.findOneBy('id', 1)
    	.then(function(i) {
			instance = i;
			return i.get('variants');
		})
		.then(function(result) {
			expect(instance.data.variants.length).equal(2);
			done();
		});
    });

    it('Get instance and lazy load properties by chain', function(done) {
    	var instance;
    	p.findOneBy('id', 1)
    	.then(function(i) {
			instance = i;
			return i.getByChain('variants:1.options:1,tags');
		})
		.then(function(result) {
			console.log(instance);
			expect(instance.data.variants.length).equal(1);
			expect(instance.data.variants[0].data.options.length).equal(1);
			done();
		});
    })

    it('Get instance and lazy load properties by description', function(done) {
    	var instance;
    	p.findOneBy('id', 1)
    	.then(function(i) {
			instance = i;
			return i.getByDescription([{property: 'variants', id:1, children: [{property: 'options', id:1}]}]);
		})
		.then(function(result) {
			console.log(instance);
			expect(instance.data.variants.length).equal(1);
			expect(instance.data.variants[0].data.options.length).equal(1);
			done();
		});
    })
});
