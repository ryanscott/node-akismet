module.exports = function(options) {

	var request = require('request');
  // var querystring = require('querystring');

	var options = options || {};

	// two required options
	var apikey = options.apikey;
	var blog = options.blog;

	var checkurlbase = options.checkurlbase || '.rest.akismet.com/1.1/comment-check';
	var verifyKeybase = 'http://rest.akismet.com/1.1/verify-key'
	var headers = options.headers || {};

	var checkurl = 'http://'+apikey+checkurlbase;

	return {
		verifyKey: function(args, cb) {
			if (typeof args == "function"){
				cb = args;
				args = {};
			}

			var params = { 
				key: apikey,
				blog: blog
			};

			// args is just override params, mostly so I can override the apikey to for testing
			for (var key in params) {
				if (key in args) {
					params.key = args.key;
				}
			}

			var options = {uri:verifyKeybase, method:'post', headers:headers, form:params};

			// console.log('akismet verifykey options: '+JSON.stringify(options) );
			request(options, function (e, r, body) {
				if (e) {
					// console.log('akismet verifykey error, request: '+r);
					// console.log('akismet verifykey error, request body: '+body);
					return cb(false);
					//throw e;
				}

				// console.log('akismet verifykey request: '+ JSON.stringify(r));
				// console.log('akismet verifykey return: ' + JSON.stringify(body));
				return cb( body == "valid" );
			});

		},

		isSpam: function(args, cb) {
			var api_params = ['blog',
												'user_ip',
												'user_agent',
												'referrer',
												'permalink',
												'comment_type',
												'comment_author',
												'comment_author_email',
												'comment_author_url',
												'comment_content'];
			var params = { blog: blog };

			for (var i in api_params) {
				var key = api_params[i]
				if (key in args) {
					params[key] = args[key];
				}
			}

			var options = {uri:checkurl, method:'post', headers:headers, form:params};

			// console.log('akismet check-comment options: '+JSON.stringify(options) );
			request(options, function (e, r, body) {
				if (e) {
					// console.log('akismet error, request: '+r);
					// console.log('akismet error, request body: '+body);
					// if akismet errors, we return ok anyway, which is false i.e. not-spam.  
					// better false negative than false positive
					return cb(false);
					//throw e;
				}

				if (body == "invalid") {
					throw new Error('invalid akismet api key');
				}

				// console.log('akismet return: ' + JSON.stringify(body));
				if (body == "true")
					return cb(true);
				else if (body == "false")
					return cb(false)
				else
					throw new Error('akismet api error: ' + body);
			});
		}
	}
}
