import { Component } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import {NgForm} from '@angular/forms';
import { EncryptionService } from '../encryption.service'

@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.css']
})
export class DecryptComponent {

	inputAsMatrix = new Array();
 	columnsText = [''];
 	decryptedText: string = '';
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
		this.clipboardApi.copyFromContent(this.decryptedText);
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
			this.inputAsMatrix = [...new Array(columns)].map(el => new Array(lines));
			
			const textChars = text.split('');
			let l = 0;
			for (let i = 0; i < columns; i++) {
				for (let j = 0; j < lines; j++) {
					if( l < text.length) {
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

			let tempMatrix = [...new Array(columns)].map(el => new Array(lines));

			for (let i = 0; i < columns; i++) {
				let index = 0;
				for (let k = 0; k < columns; k++) {
					if ( sortedIndices[k] == i ) 
						index = k;
				}
				for (let j = 0; j < lines; j++) {
					tempMatrix[i][j] = this.inputAsMatrix[index][j];
				}
			}

			let outputMatrix = [...new Array(lines)].map(el => new Array(columns));
			for (let i = 0; i < lines; i++) {
				for (let j = 0; j < columns; j++) {
					outputMatrix[i][j] = tempMatrix[j][i];
				}
			}
			
			let outputArray = new Array(text.length);
			let ii = 0;
			for (let i = 0; i < lines; i++) {
				for (let j = 0; j < columns; j++) {
					outputArray[ii] = outputMatrix[i][j];
					ii++;
				}
			}

			this.decryptedText = '';

			for(let i = 0; i < outputArray.length; i++) {
				this.decryptedText = this.decryptedText.concat(outputArray[i]);
			}
		}
	}
}
