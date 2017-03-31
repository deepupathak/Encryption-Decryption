import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { file } from '../collections/file_collection.js';

var swal = require('sweetalert');

var CryptoJS = require("crypto-js");
var key = '1234567890';

var FileReader = require('filereader');
var fileReader = new FileReader();

// App component - represents the whole app
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flag: 0,
			file: 0,
			json:"",
			ciphertext: '',
			uploading: [],
      progress: 0,
      inProgress: false
		};
	}
	encrypt(event){
		event.preventDefault();
		
		// var AES = require("crypto-js/aes");
		// var SHA256 = require("crypto-js/sha256");
		
		var message = this.refs.message.value;
		if(message != ""){
			// Encrypt
			var ciphertext = CryptoJS.AES.encrypt(message, key);
			this.setState({
				flag: 1,
				ciphertext: ciphertext
			});
			alert("CIPHERTEXT-> " + ciphertext)
	
			var hmacsha1 = CryptoJS.HmacSHA1(message, key)
			// console.log("HmacSHA1 =>", hmacsha1);
			alert("SHA1-> " + hmacsha1)
	
			var createHash = require('sha.js')
			var sha256 = createHash('sha256')
			var sha512 = createHash('sha512')
	
			var h = sha256.update(message, 'utf8').digest('hex');
			// console.log("SHA256-> ", h)
			alert("SHA256-> " + h)

			var a = sha512.update(message, 'utf8').digest('hex');
			alert("SHA512-> " + a)
			// var cipher = SHA256(message)
			// console.log("Cipher text =>", ciphertext);
			this.refs.message.value = "";
		}else{
			alert("Please enter message first")
		}
	}
	decrypt(event){
		event.preventDefault();
		// Decrypt
		var bytes  = CryptoJS.AES.decrypt(this.state.ciphertext.toString(), key);
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);
		console.log("Plain text =>", plaintext)
		alert(plaintext);
	}
	reset(event){
		event.preventDefault();
		this.setState({
			flag: 0,
			ciphertext: '',
			file: 0,
			json: ""
		});
	}
	fileEncrypt(event){
		event.preventDefault();
		var regex = /[^.]+$/;
		// console.log("json =>", JSON.stringify(this.state.json))
		var File = $('#file')[0].files[0];
		// console.log("file encrypt ===>", File)
		// console.log("file ref --->", this.refs['fileinput'])
		// if($('#file')[0].files[0] != undefined){
			// if (regex.exec(File.name)[0] == "json") {
				var data = this.state.json;
				// Encrypt 
				var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key);
				
				this.setState({
					file: 1,
					ciphertext: ciphertext
				});

				// console.log("CIPHERTEXT =>", ciphertext)
				alert(ciphertext);
				// $("#log").text(ciphertext)
				// swal("success", "Cipher text ->" + ciphertext, "success");
			// }else{
				// console.log("Not a json format")
				// alert("Not a json format");
			// }
		/*}else{
			alert("Please input a file first");
		}*/
	}
	fileDecrypt(event){
		event.preventDefault();
		// Decrypt 
		var bytes  = CryptoJS.AES.decrypt(this.state.ciphertext.toString(), key);
		var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		console.log("DECRYPTED DATA =>", decryptedData)
		alert(JSON.stringify(decryptedData));
	}
	upload(event){
		event.preventDefault();
		let self = this;
		var regex = /[^.]+$/;
		var File = $('#file')[0].files[0];
		console.log("File ---->", File)
		if($('#file')[0].files[0] != undefined){
			// if (regex.exec(File.name)[0] == "json") {
				if(File){
					fileReader.onload = (event) => {
						console.log("result --->", event.target.result)
						/*try {
							if(JSON.parse(event.target.result)){
								this.setState({
									json: JSON.parse(event.target.result)
								});
							}
						} catch (e) {
							alert('Invalid json format');
							return false;
						}*/
					};
					// fileReader.readAsText(File);
				}
			// }else{
			// 	console.log("Not a json format")
			// 	// alert("Not a json format")
			// 	// console.log("file ==>", File)
			// 	let uploadInstance = file.insert({
			// 		file: File,
			// 		/*meta: {
			// 			locator: self.props.fileLocator,
			// 			userId: Meteor.userId() // Optional, used to check on server for file tampering
			// 		},*/
			// 		streams: 'dynamic',
			// 		chunkSize: 'dynamic',
			// 		allowWebWorkers: true // If you see issues with uploads, change this to false
			// 	}, false);

			// 	self.setState({
			// 		uploading: uploadInstance, // Keep track of this instance to use below
			// 		inProgress: true // Show the progress bar now
			// 	});

			// 	// These are the event functions, don't need most of them, it shows where we are in the process
			// 	uploadInstance.on('start', function () {
			// 		console.log('Starting');
			// 	});

			// 	uploadInstance.on('end', function (error, fileObj) {
			// 	// console.log('On end File Object: ', fileObj);
			// 	});

			// 	uploadInstance.on('uploaded', function (error, fileObj) {
			// 		console.log('uploaded: ', fileObj);

			// 		// var fs = require('fs');

			// 		// console.log(fs.readFile(fileObj.path, 'utf8'));
			// 		// fs.readFileSync

			// 		// Remove the filename from the upload box
			// 		self.refs['fileinput'].value = '';

			// 		// Reset our state for the next file
			// 		self.setState({
			// 			uploading: [],
			// 			progress: 0,
			// 			inProgress: false
			// 		});
			// 	});

			// 	uploadInstance.on('error', function (error, fileObj) {
			// 		console.log('Error during upload: ' + error);
			// 	});

			// 	uploadInstance.on('progress', function (progress, fileObj) {
			// 		console.log('Upload Percentage: ' + progress);
			// 		// Update our progress bar
			// 		self.setState({
			// 			progress: progress
			// 		})
			// 	});
			// 	uploadInstance.start(); // Must manually start the upload
			// }
		}else{
			alert("Please input file")
		}
	}
	showUploads() {
		// console.log('**********************************', this.state.uploading);
		if (!_.isEmpty(this.state.uploading)) {
			return (
				<div>
					{ this.state.uploading.file.name }

					<div className="progress progress-bar-default">
						<div style={{width: this.state.progress + '%'}} aria-valuemax="100" aria-valuemin="0"  aria-valuenow={this.state.progress || 0} role="progressbar" className="progress-bar">
							<span className="sr-only">{this.state.progress}% Complete (success)</span>
							<span>{this.state.progress}%</span>
						</div>
					</div>
				</div>
			);
		}
	}
	render() {
		// console.log("docs ---->", this.props.docs)
		return (
			<div>
				<form className="well">
					<h3>Encryption/Decryption of text</h3>
					{
						this.state.flag == 0 ?
							<div className="form-group">
								<input type="text" className="form-control" id="message" ref="message" placeholder="Enter your message here" required/>
							</div>
						:''
					}

					{
						this.state.flag == 0 ?
							<div className="form-group">
								<button type="button" className="btn btn-default form-control" onClick={this.encrypt.bind(this)}>Encrypt</button>
							</div>
						:
						<div className="form-group">
							<button type="button" className="btn btn-default form-control" onClick={this.decrypt.bind(this)}>Decrypt</button>
						</div>
					}

					{
						this.state.flag == 1 ?
							<button type="button" className="btn btn-default" onClick={this.reset.bind(this)}>Reset</button>
						:''
					}
					<br />
					<hr />
					<br />
					<h3>Encryption/Decryption of file</h3>
					{
						this.state.file == 0 ?
							<div className="form-group">
								<input type="file" id="file" ref="fileinput" disabled={this.state.inProgress} onChange={this.upload.bind(this)}/>
							</div>
						:''
					}
					{
						this.showUploads()
					}

					{
						this.state.file == 0 ?
							<div className="form-group">
								<button type="button" className="btn btn-default form-control" onClick={this.fileEncrypt.bind(this)}>Encrypt</button>
							</div>
						:
						<div className="form-group">
							<button type="button" className="btn btn-default form-control" onClick={this.fileDecrypt.bind(this)}>Decrypt</button>
						</div>
					}
					{
						this.state.file == 1 ?
							<button type="button" className="btn btn-default" onClick={this.reset.bind(this)}>Reset</button>
						:''
					}
					<p id="log"></p>
				</form>
			</div>
		);
	}
}

export default createContainer(() => {
	var handle = Meteor.subscribe('files.all');
	return {
		isReady: handle.ready(),
		docs: file.find().fetch() // Collection is UserFiles
	};
}, App);