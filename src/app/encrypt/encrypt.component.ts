import { Component} from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import {NgForm} from '@angular/forms';
import { EncryptionService } from '../encryption.service'

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})
export class EncryptComponent {

	inputAsMatrix = new Array();
 	columnsText = [''];
 	encryptedText: string = '';
	errMesg: string = '';
	
	constructor(config: 					NgbModalConfig,
				private modalService: 		NgbModal,
				private clipboardApi: 		ClipboardService,
				private encryptionService: 	EncryptionService) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	openScrollableContent(content: any) {
		this.modalService.open(content, { centered: true });
	}

	copyText() {
		this.clipboardApi.copyFromContent(this.encryptedText);
	}

 	onSubmit(f: NgForm) {
		
 	  	let word: string = f.value.inputWord;
 	  	let text: string = f.value.inputText;

		if ( text == '' || text == ' ' ) {
			this.errMesg = 'Der Text ist leer, bitte geben Sie einen Text ein!'
			alert(this.errMesg);
		}
		else if ( word == '' || word == ' ' ) {
			this.errMesg = 'Bitte geben Sie ein Wort ein!'
			alert(this.errMesg);
		}
		else {
 	  		let columns = word.length;
			let lines = 0;
 	  		if(text.length % word.length == 0) {
 	  		  lines = text.length/word.length;
 	  		}
 	  		else{
 	  		  lines = parseInt(String(text.length/word.length)) + 1;
 	  		}

 	  		const textChars = text.split('');

			this.inputAsMatrix = [...new Array(lines)].map(el => new Array(columns));
			
 	  		let l = 0;
 	  		for (let i = 0; i < lines; i++) {
 	  		  for (let j = 0; j < columns; j++) {
 	  		    if( l < text.length)
 	  		    {
					this.inputAsMatrix[i][j] = textChars[l];
 	  		        l++;
 	  		    }
 	  		    else {
 	  		      	this.inputAsMatrix[i][j] = ' ';
 	  		    }
 	  		  }
 	  		}
 	  		this.columnsText = word.split('');
			
 	  		let sortedIndices = this.encryptionService.sortIndices(this.columnsText);

 	  		let outputMatrix = [...new Array(columns)].map(el => new Array(lines));
 	  		for (let i = 0; i < columns; i++) {
 	  		  for (let j = 0; j < lines; j++) {
 	  		    outputMatrix[i][j] = this.inputAsMatrix[j][sortedIndices[i]];
 	  		  }
 	  		}

 	  		let outputArray = new Array();
 	  		for(let i = 0; i < outputMatrix.length; i++) {
 	    		outputArray =  outputArray.concat(outputMatrix[i]);
 	  		}

			this.encryptedText = '';
 	  		for(let i = 0; i < outputArray.length; i++) {
 	      		this.encryptedText = this.encryptedText.concat(outputArray[i]);
			}
 	  	}
 	}
}