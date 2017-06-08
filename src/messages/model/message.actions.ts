/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Definition einer ESTA Message
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {MessageTypes} from './message.types';
import {Message} from 'primeng/primeng';

export interface MessageActions {
    type: MessageTypes;
    message ?: Message;
}