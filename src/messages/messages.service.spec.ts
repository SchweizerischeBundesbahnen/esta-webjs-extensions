import {TestBed} from '@angular/core/testing';
import {GrowlModule} from 'primeng/primeng';
import {MessagesService} from './messages.service';

describe('Message Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GrowlModule],
            providers: [MessagesService]
        });
    });

    it('should create a successmessage and stream it into the message subject', done => {
        // given
        const sut = TestBed.get(MessagesService);
        const messageContent = 'Awesome Message';
        const messageSummary = 'Success';
        const expectedMessage = {
            severity: 'success',
            summary: messageSummary,
            detail: messageContent
        };
        sut.getMessageStream()
            .subscribe(message => {
                expect(message).toEqual(expectedMessage);
                done();
            });
        // when
        sut.createSuccessMessage(messageContent, messageSummary);
    });

    it('should create a errormessage and stream it into the message subject', done => {
        // given
        const sut = TestBed.get(MessagesService);
        const messageContent = 'Awful Error';
        const messageSummary = 'Error';
        const expectedMessage = {
            severity: 'error',
            summary: messageSummary,
            detail: messageContent
        };
        sut.getMessageStream()
            .subscribe(message => {
                expect(message).toEqual(expectedMessage);
                done();
            });
        // when
        sut.createErrorMessage(messageContent, messageSummary);
    });

    it('should create a infomessage and stream it into the message subject', done => {
        // given
        const sut = TestBed.get(MessagesService);
        const messageContent = 'Super important information';
        const messageSummary = 'Information';
        const expectedMessage = {
            severity: 'info',
            summary: messageSummary,
            detail: messageContent
        };
        sut.getMessageStream()
            .subscribe(message => {
                expect(message).toEqual(expectedMessage);
                done();
            });
        // when
        sut.createInfoMessage(messageContent, messageSummary);
    });

    it('should create a warningmessage and stream it into the message subject', done => {
        // given
        const sut = TestBed.get(MessagesService);
        const messageContent = 'Super important warning';
        const messageSummary = 'Warning';
        const expectedMessage = {
            severity: 'warn',
            summary: messageSummary,
            detail: messageContent
        };
        sut.getMessageStream()
            .subscribe(message => {
                expect(message).toEqual(expectedMessage);
                done();
            });
        // when
        sut.createWarningMessage(messageContent, messageSummary);
    });

    it('should stream a new message in the clearStream when calling clearMessages', done => {
        // given
        const sut = TestBed.get(MessagesService);
        sut.getCancelStream()
            .subscribe(e => done());
        // when
        sut.clearMessages();
    });
});
