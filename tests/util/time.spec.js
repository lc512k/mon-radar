const assert = require('assert');
const time = require('../../util/time');

describe('The time utility', () => {
	it('should return time in min and sec', async () => {
		const date = new Date(1507970555 * 1000);
		const laterDate = new Date(1507970855 * 1000);
		const timeDelta = time(laterDate - date);
		assert(typeof timeDelta, 'string');
		assert(timeDelta.indexOf(':') > 0);
		const min = timeDelta.substring(0, timeDelta.indexOf(':'));
		const sec = timeDelta.substring(timeDelta.indexOf(':') + 1, timeDelta.length - 1);
		assert(typeof min, 'number');
		assert(typeof sec, 'number');
	});
});