import { ContextError } from '../../error/ErrorHandler'

export default class TextError extends ContextError {
    phone: string
    constructor(type: string, phone: string, message: string) {
        super(`Text Error: ${message}`)
        this.phone = phone
        this.context = { phone, type }
        Error.captureStackTrace(this, TextError)
    }
}

export class UnsubscribeTextError extends TextError { }

export class UndeliverableTextError extends TextError { }

export class RateLimitTextError extends TextError { }
