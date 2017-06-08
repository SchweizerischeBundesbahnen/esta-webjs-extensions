/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Servcice
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {Observable} from 'rxjs/Observable';
import {Message} from 'primeng/primeng';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {MessageSeverities} from './model/message.severities';
import {MessageActions} from './model/message.actions';
import {MessageTypes} from './model/message.types';

@Injectable()
export class MessagesService {

    private message$: Subject<MessageActions> = new Subject<MessageActions>();

    constructor() {
    }

    public createSuccessMessage(messageContent: string, summary: string): void {
        this.createMessage(MessageSeverities.SUCCESS, summary, messageContent);
    }

    public createInfoMessage(messageContent: string, summary: string): void {
        this.createMessage(MessageSeverities.INFO, summary, messageContent);
    }

    public createWarningMessage(messageContent: string, summary: string): void {
        this.createMessage(MessageSeverities.WARN, summary, messageContent);
    }

    public createErrorMessage(messageContent: string, summary: string): void {
        this.createMessage(MessageSeverities.ERROR, summary, messageContent);
    }

    private createMessage(severity: string, summary: string, detail: string): void {
        const message: Message = {severity, summary, detail};
        this.message$.next({type: MessageTypes.ADD, message});
    }

    public clearMessages(): void {
        this.message$.next({type: MessageTypes.CLEAR});
    }

    public getMessageStream(): Observable<MessageActions> {
        return this.message$.asObservable();
    }
}
