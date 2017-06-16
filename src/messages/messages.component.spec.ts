/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Message Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 16.06.2017, 2017.
 */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {GrowlModule} from 'primeng/primeng';
import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';

fdescribe('Message Component', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;

    beforeEach(async() => {
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

    it('should contain a empty array called messages', () => {
        expect(component.messages).toEqual([]);
    });
});