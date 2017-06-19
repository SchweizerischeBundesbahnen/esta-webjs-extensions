/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 07.06.2017, 2017.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    @Output() onClose = new EventEmitter<any>();

    constructor(private messageService: MessagesService) {
        this.subscribeForMessages();
    }

    public subscribeForMessages() {
        this.messages = [];
        this.messageService.getMessageStream()
            .do(message => this.messages.push(message))
            .mergeMap(message => this.getLifeTimeStream())
            .takeUntil(this.messageService.getCancelStream())
            .subscribe(
                e => this.removeFirstMessage(),
                err => {
                    throw err;
                },
                () => this.subscribeForMessages()
            );
    }

    public removeFirstMessage() {
        this.messages.shift();
    }

    public getLifeTimeStream(): Observable<any> {
        if (this.life > DEFAULT_LIFETIME) {
            return Observable.timer(this.life);
        }
        return Observable.empty();
    }

    public messageClosed($event) {
        this.onClose.next($event);
    }
}
