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
});
