const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron')
const path = require('path')
const app = require('electron').remote


describe("Application launch test", function () {
	this.timeout(20000)	
	beforeEach(function () {
		const appPath = path.join(__dirname, "../");
		this.app = new Application({
			path: electronPath,
			args: [appPath],
			startTimeout: 10000
  		});
		return this.app.start();      
	});
 	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop();
		}
	});
	it('Application compiles correctly.', function () {
		return this.app.client.getWindowCount().then(function (count) {
		assert.equal(count, 1)
		})
	})

	it('Content displayed correctly.', function () {
		return this.app.client.browserWindow.getTitle().then(function (title) {
		assert.equal(title, 'Kachow')
		})
	});
});
