/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Definition einer ESTA Message
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {MessageAction} from './message.actions';
import {Message} from 'primeng/primeng';

export interface EstaMessage {
    action: MessageAction;
    message ?: Message;
}