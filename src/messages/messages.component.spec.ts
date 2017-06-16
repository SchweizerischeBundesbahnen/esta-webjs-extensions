/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 16.06.2017, 2017.
 */
import {TestBed, inject} from '@angular/core/testing';
import {GrowlModule, Message} from 'primeng/primeng';
import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/never';

describe('Message Component', () => {
    class MockMessagesService {
        public getMessageStream() {
        }

        public getCancelStream() {
        }
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [GrowlModule],
            declarations: [MessagesComponent],
            providers: [MessagesService]
        })
            .compileComponents();
    });

    fdescribe('Subscribe for messages', () => {

        const createMessage = (severity: string, summary: string, detail: string) => (
            {severity, summary, detail}
        );

        it(`should add all arriving messages and not emit a new value which indicates an 
            unsihft of the messages`,
            inject([MessagesService], (messagesService: MessagesService) => {
                // given
                const expectedMessages: Array<Message> = [
                    createMessage('success', 'awesome message', 'awesome detail'),
                    createMessage('wanring', 'awesome message', 'awesome detail'),
                    createMessage('error', 'awesome message', 'awesome detail')
                ];
                const messages$ = Observable.create(observer => {
                    expectedMessages.forEach(message => {
                        observer.next(message);
                    });
                });
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);
                spyOn(messagesService, 'getCancelStream').and.returnValue(Observable.never());
                const fixture = TestBed.createComponent(MessagesComponent);
                const component = fixture.componentInstance;
                // when
                component.subscribeForMessages();
                // then
                expect(component.messages).toEqual(expectedMessages);
            }));
    });
});
