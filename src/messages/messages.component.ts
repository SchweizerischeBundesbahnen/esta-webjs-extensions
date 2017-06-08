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
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import {Observable} from 'rxjs/Observable';
import {MessagesService} from './messages.service';
import {MessageTypes} from './model/message.types';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent {

    public messages: Array<Message> = [];
    @Input() style: any;
    @Input() styleClass: any;
    @Input() life = 0;

    constructor(private messageService: MessagesService) {
        this.messageService.getMessageStream()
            .do(messageAction => {
                if (messageAction.type === MessageTypes.ADD) {
                    this.addMessage(messageAction.message);
                } else {
                    this.resetMessages();
                }
            })
            .mergeMap(messageAction => {
                if (this.life === 0 && messageAction.type === MessageTypes.CLEAR) {
                    return Observable.empty();
                }
                return Observable.timer(this.life);
            })
            .subscribe(_ => this.messages.shift());
    }

    private addMessage(message: Message): void {
        this.messages.push(message);
    }

    private resetMessages(): void {
        this.messages = [];
    }
}
