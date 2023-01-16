import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})
export class EncryptComponent {

	@Input() item = '';

  constructor(config: NgbModalConfig, private modalService: NgbModal, private clipboardApi: ClipboardService) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
	}

	openScrollableContent(content: any) {
		this.modalService.open(content, { centered: true });
	}

	copyText() {
		this.clipboardApi.copyFromContent(this.item);
	  }
}
