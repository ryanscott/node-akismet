#node-akismet

Integration with Akismet spam filtering for node.js

## Installation

`npm install node-akismet`

## Tests

`AKISMET_API=abc123abc123 npm test`

For the tests to pass, you need a valid akismet api key.  You can add it to the command line as shown above, or hardcode it into test/akismet_test.js if you prefer.  

There is no test api key for akismet, you can get a valid api key for free at https://akismet.com/signup/

## Usage Overview


    var akismet_options = {
	    apikey: 'abc123abc123', // required: your akismet api key
	    blog: 'http://www.testhost.com', // required: your root level url
	    headers:  // optional, but akismet likes it if you set this 
	    { 
			'User-Agent': 'testhost/1.0 | node-akismet/0.0.1'
		}
    };
    
    Akismet = require('../lib/akismet')(akismet_options);

	Akismet.isSpam(args, function(isSpam) {
		if (isSpam) {
			// quarantine that
			console.log('we gots spammed');
		}
		else {
			// continue about your business
			console.log('all good, carry on');
		}
	}

## API Overview

`Akismet = require('../lib/akismet')(akismet_options);`

takes a list of parameters:

* `apikey:` - requred: your api key from Akismet
* `blog:` - required: your top-level url, including the http://
* `headers:` - optional: the only header Akismet seems to care about is 'User-Agent', see the bottom of http://akismet.com/development/api/ for the format they prefer


`Akismet.isSpam(args, cb)`

calls cb() with the truth value of the api call to Akismet.  

Throws an Error if Akismet returns anything besides true or false (usually happens when key or args are invalid)

valid args keys are:

	var args = ['blog',
				'user_ip',
				'user_agent',
				'referrer',
				'permalink',
				'comment_type',
				'comment_author',
				'comment_author_email',
				'comment_author_url',
				'comment_content'];

you can see documentation for what each should be here: http://akismet.com/development/api/#comment-check

the blog value is optional if you set it in the constructor.

`Akismet.verifyKey(args, cb)`

test call to ensure your api key is valid, used in automated test, usually does not need to be called from your application code.  args is completely optional, if you set apikey and blog values in the constructor.

##Todo

implement submitSpam and submitHam methods
