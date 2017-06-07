/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 07.06.2017, 2017.
 */
import {Component, Input} from '@angular/core';
import {Message} from 'primeng/primeng';
import {MessagesService} from './messages.service';
import {MessageAction} from './model/message.actions';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent {

    public messages: Array<Message> = [];
    @Input() style: any;
    @Input() styleClass: any;

    constructor(private messageService: MessagesService) {
        this.messageService.getMessageStream()
            .subscribe(estaMessage => {
                if (estaMessage.action === MessageAction.ADD) {
                    this.messages.push(estaMessage.message);
                } else {
                    this.messages = [];
                }
            });
    }
}
