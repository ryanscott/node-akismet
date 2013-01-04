process.env.NODE_ENV = 'test';

var api_key = process.env.AKISMET_API;

if (!api_key)
{
  // you can hardcode your api key here if you like.
	api_key = 'abc123abc123';

	if ( api_key == 'abc123abc123' )
	{
	  console.log('To run tests, either set the AKISMET_API env variable, or add your key to the top of akismet_test.js');
    process.exit(2)
	}
}

var akismet_options = {
	apikey: api_key,
	blog: 'http://www.testhost.com',
	headers: { 
				 'User-Agent': 'testhost/1.0 | node-akismet/0.0.1'
			}
};

expect = require('chai').expect;
Akismet = require('../lib/akismet')(akismet_options);

describe('Akismet', function (){
	describe('#verifykey()', function (){
		it('shoud fail with invalid apikey', function(done){
			Akismet.verifyKey({key:"invalid_key"},function(key_verified){
				expect(key_verified).to.equal(false);
				done();
			});
		});

		it('shoud syccessfully verify valid apikey', function(done){
			Akismet.verifyKey(function(key_verified){
				expect(key_verified).to.equal(true);
				done();
			});
		});
	});

	describe('#isSpam()', function (){
		it('should call akismet with ham and return false', function(done){
			// var api_params = ['blog',
			// 									'user_ip',
			// 									'user_agent',
			// 									'referrer',
			// 									'permalink',
			// 									'comment_type',
			// 									'comment_author',
			// 									'comment_author_email',
			// 									'comment_author_url',
			// 									'comment_content'];

			var params = { 'blog': 'http://www.storify.com',
										 'user_ip': '123.45.67.89'};

			Akismet.isSpam(params, function(is_spam){
				expect(is_spam).to.equal(false);
				done();
			});
		});

		it('should call akismet with spam and return true', function(done){
			// var api_params = ['blog',
			// 									'user_ip',
			// 									'user_agent',
			// 									'referrer',
			// 									'permalink',
			// 									'comment_type',
			// 									'comment_author',
			// 									'comment_author_email',
			// 									'comment_author_url',
			// 									'comment_content'];

			var params = { 'blog': 'http://www.storify.com',
										 'user_ip': '123.45.67.89',
										 'comment_author':'viagra-test-123'};

			Akismet.isSpam(params, function(is_spam){
				expect(is_spam).to.equal(true);
				done();
			});
		});

	});
});