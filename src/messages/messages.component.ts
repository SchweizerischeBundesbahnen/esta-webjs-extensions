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
        this.createStream();
    }

    private createStream() {
        this.messages = [];
        this.messageService.getMessageStream()
            .do(message => this.messages.push(message))
            .mergeMap(message => this.life > 0 ? Observable.timer(this.life) : Observable.empty())
            .takeUntil(this.messageService.getCancelStream())
            .subscribe(
                e => this.messages.shift(),
                err => console.error(err),
                () => this.createStream()
            );
    }
}
