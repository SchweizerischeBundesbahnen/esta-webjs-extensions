/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Interface für eine EstaMessage
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 21.06.2017, 2017.
 */
export interface EstaMessage {
    id: string;
    severity: string;
    summary: string;
    detail: string;
}