import { file } from '../imports/collections/file_collection.js';

Meteor.publish('files.all', function () {
	return file.find().cursor;
});