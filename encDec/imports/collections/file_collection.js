import { FilesCollection } from 'meteor/ostrio:files';

export const file = new FilesCollection({
	collectionName: 'files',
	allowClientCode: true,
	downloadRoute: '/files/',
	storagePath: 'assets/files/',
});

if (Meteor.isServer) {
	file.deny({
		insert: function() {
			return false;
		},
		update: function() {
			return true;
		},
		remove: function() {
			return false;
		}
	});
	
	file.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return false;
    },
    remove: function() {
      return true;
    }
  });
}