<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Messages Modul](#messages-modul)
  - [Wie verwendet man das ESTA-Messages Modul?](#wie-verwendet-man-das-esta-messages-modul)
    - [Installation](#installation)
    - [Message Komponente](#message-komponente)
      - [Input](#input)
      - [Output](#output)
    - [MessageService](#messageservice)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Messages Modul

Beim MessagesModul handelt es sich um einen Wrapper um das Growl Modul
von PrimeNG. Das von PrimeNG bereitgestellte Growl Modul bietet leider
keine Möglichkeit Messages über einen zentralen Service zu erstellen. Bei PrimeNG
sind die Messages stark an die Komponente gekoppelt. Weiter werden die non sticky Growl Messages bei PrimeNg
nicht schön nacheinander entfernt sondern alle gleichzeitig. Der ESTA-MessageService
bietet diese Funktionalität an.

## Wie verwendet man das ESTA-Messages Modul?
### Installation
Das MessageModul ist Teil der Esta-Webjs-extensions. Diese sind auf npm
gehostet und können daher über folgenden Command installiert werden:

```
npm install --save esta-webjs-extensions
```

Um den MessageService sowie die Message Component zu verwenden muss zuerst das
MessageModul aus esta-webjs-extensions in die Applikation importiert werden.
z.B im app.module.ts:

```javascript
import {MessagesModule} from 'esta-webjs-extensions';

@NgModule({
    declarations: [AppComponent],
    imports: [MessagesModul]
})
...
```


### Message Komponente

Das ESTA Message Modul stellt eine Komponente namens: esta-messages bereit.
Diese Komponente kann zentral in die Applikation eingebunden werden.
z.B in app.component.html.
```html
<app-navbar></app-navbar>
<esta-messages></esta-messages>
<div class="container">
    <router-outlet></router-outlet>
</div>
```

Die Komponente esta-messages verfügt über folgende Inputs und Outputs:

#### Input
- **style:** Inline Styles für die Growl Komponente von PrimeNG
- **styleClass:** Style Klasse für die Growl Komponente von PrimeNG
- **life:** Integer in Milisekunden wie lange jede einzelne Message erscheinen
  soll. Bei der Eingabe von 3000 verschwindet jede erstellte Message nach
  3 Sekunden. Falls nichts angegeben wird verschwinden die Messages erst
  beim Aufruf der Clear Methode des Messageservices oder wenn der User diese über
  das x löscht.

#### Output
- **onClose** Wirft ein Event welches die soeben geschlossene Message
    beinhaltet

### MessageService
Der MessageService bietet die Möglichkeit Messages zu erstellen und zu löschen.
Der MessageService kann in jeder beliebigen Komponente injected werden.

```javascript
import {MessagesService} from 'esta-webjs-extensions';

@Component({
    selector: ...,
    templateUrl: ...
})
export class SampleComponent{

    constructor(private messagesService: MessagesService){
    }
}
```

Der Messages Service stellt folgende Methoden zur Erstellung von Messages bereit.
Jede Methode nimmt den Inhalt der Message sowie einen Titel entgegen.

- createSuccessMessage(messageContent: string, summary: string): void
- createInfoMessage(messageContent: string, summary: string): void
- createWarningMessage(messageContent: string, summary: string): void
- createErrorMessage(messageContent: string, summary: string): void

Um sämtliche Nachrichten zu löschen kann die Methode **clearMessages()** vom MessageService aufgerufen werden.



