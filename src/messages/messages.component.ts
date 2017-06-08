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
import 'rxjs/add/operator/takeUntil';
import {Observable} from 'rxjs/Observable';
import {MessagesService} from './messages.service';

const DEFAULT_LIFETIME = 0;

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent {

    public messages: Array<Message> = [];
    @Input() style: any;
    @Input() styleClass: any;
    @Input() life = DEFAULT_LIFETIME;

    constructor(private messageService: MessagesService) {
        this.subscribeForMessages();
    }

    private subscribeForMessages() {
        this.messages = [];
        this.messageService.getMessageStream()
            .do(message => this.messages.push(message))
            .mergeMap(message => this.life > DEFAULT_LIFETIME ?
                Observable.timer(this.life) : Observable.empty())
            .takeUntil(this.messageService.getCancelStream())
            .subscribe(
                e => this.messages.shift(),
                err => console.error(err),
                () => this.subscribeForMessages()
            );
    }
}
