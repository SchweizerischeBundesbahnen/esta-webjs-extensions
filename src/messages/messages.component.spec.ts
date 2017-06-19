/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 16.06.2017, 2017.
 */
import {TestBed, inject, ComponentFixture} from '@angular/core/testing';
import {GrowlModule, Message} from 'primeng/primeng';
import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/of';

describe('Message Component', () => {

    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;

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

    beforeEach(() => {
        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
    });

    describe('Subscribe for messages', () => {

        const createMessage = (severity: string, summary: string, detail: string) => (
            {severity, summary, detail}
        );

        it(`should add all arriving messages and not emit a new value which indicates that 
            none of the messages should be removed`,
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
                // when
                component.subscribeForMessages();
                // then
                expect(component.messages).toEqual(expectedMessages);
            }));

        it('should return an empty observable when no lifetime is set', () => {
            // given
            spyOn(Observable, 'empty');
            // when
            component.getLifeTimeStream();
            // then
            expect(Observable.empty).toHaveBeenCalled();
        });

        it('should return an observable that emits a value in after the lifetime has passed', () => {
            // given
            spyOn(Observable, 'timer');
            component.life = 3000;
            // when
            component.getLifeTimeStream();
            // then
            expect(Observable.timer).toHaveBeenCalledWith(3000);
        });

        it('it should call unshift in subscribe when a message is cleared',
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
                spyOn(component, 'getLifeTimeStream').and.returnValue(Observable.of(1));
                spyOn(Array.prototype, 'shift');
                // when
                component.subscribeForMessages();
                // then
                expect(Array.prototype.shift).toHaveBeenCalledTimes(3);
            })
        );

        it(`it should call unshift in subscribe until the clearStream emits a value,
            in this case it should automatically resubscribe to the messagestream`,
            inject([MessagesService], (messagesService: MessagesService) => {
                // given
                let numberOfCalls = 0;
                const expectedMessages = [
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
                spyOn(messagesService, 'getCancelStream').and.callFake(() => {
                    if (numberOfCalls === 0) {
                        numberOfCalls++;
                        return Observable.of(1);
                    }
                    return Observable.empty();
                });
                spyOn(component, 'getLifeTimeStream').and.returnValue(Observable.of(1));
                spyOn(Array.prototype, 'shift');
                spyOn(component, 'subscribeForMessages').and.callThrough();
                // when
                component.subscribeForMessages();
                // then
                expect(component.subscribeForMessages).toHaveBeenCalledTimes(2);
            }));

        it('should remove the first message', () => {
            // given
            const message1 = createMessage('success', 'awesome message', 'awesome detail');
            const message2 = createMessage('wanring', 'awesome message', 'awesome detail');
            const message3 = createMessage('error', 'awesome message', 'awesome detail');
            component.messages = [message1, message2, message3];
            // when
            component.removeFirstMessage();
            // then
            expect(component.messages).toEqual([message2, message3]);
        });

        it('should throw an error when an error occures',
            inject([MessagesService], (messagesService: MessagesService) => {
                // given
                const errorMessage = 'Awful error';
                const messages$ = Observable.throw(new Error(errorMessage));
                spyOn(messagesService, 'getMessageStream').and.returnValue(messages$);

                // when then
                expect(() => component.subscribeForMessages()).toThrowError(errorMessage);
            }));

        it('should emit a the onClosed event when a message is closed', () => {
            // given
            spyOn(component.onClose, 'next');
            const $event = {
                message: 'Awesome Message'
            };
            // when
            component.messageClosed($event);
            // then
            expect(component.onClose.next).toHaveBeenCalledWith($event);
        });
    });
});
