import {NgModule} from '@angular/core';
import {GrowlModule} from 'primeng/primeng';
import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';

@NgModule({
    imports: [
        GrowlModule
    ],
    declarations: [MessagesComponent],
    providers: [MessagesService],
    exports: [MessagesComponent]
})
export class MessagesModule {
}
