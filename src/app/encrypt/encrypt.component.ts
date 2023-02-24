import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import {NgForm} from '@angular/forms';
import { EncryptionService } from '../encryption.service';
import gql from 'graphql-tag';
import { Apollo} from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const UENCRYPT_POST = gql`
  		mutation EncryptPost($encryptedText: string!) {
    		EncryptPost(encryptedText: $string) {
				encrypted
    		}
  		}
	`;

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})

export class EncryptComponent implements OnInit, OnDestroy  {

	private querySubscription = new Subscription;
	inputAsMatrix = new Array();
	wordAsChar = [''];
 	encryptedText: string = '';
	errMesg: string = '';
	inputText: string = '';
	inputWord: string = '';

	constructor(config: 					NgbModalConfig,
				private modalService: 		NgbModal,
				private clipboardApi: 		ClipboardService,
				private encryptionService: 	EncryptionService,
				private apollo:             Apollo) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.querySubscription = this.apollo
      .watchQuery({
        query: gql`
          {
            encrypted {
				encrypted
			}
          }
        `,
      })
      .valueChanges.subscribe((data: any) => { this.encryptedText = data.encrypted; } );
	}

	ngOnDestroy() {
		//this.querySubscription.unsubscribe();
	  }

	openScrollableContent(content: any) {
		this.modalService.open(content, { centered: true });
	}

	copyText() {
		this.clipboardApi.copyFromContent(this.encryptedText);
	}

	encodeInBackend() {
		this.apollo
		  .mutate({
			mutation: gql`
			mutation {
				createEncryptedtext(inputText: "abc", inputWord:"word") {
				  encryptedText {
					inputText
					inputWord
				  }
				}
			  }
		  `,
			variables: {
				inputText: "abc",
				inputWord:"word"
			},
		  }).subscribe((data: any) => { data.inputText = this.inputText; data.inputWord = this.inputWord })
	  }

 	onSubmit(f: NgForm) {
		this.inputText = f.value.inputText;
		this.inputWord = f.value.inputWord;
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
 	  		this.wordAsChar = word.split('');
			
 	  		let sortedIndices = this.encryptionService.sortIndices(this.wordAsChar);

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