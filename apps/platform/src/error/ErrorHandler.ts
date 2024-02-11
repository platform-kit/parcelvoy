import { DriverConfig } from '../config/env'
import Koa from 'koa'
import BugSnagProvider, { BugSnagConfig } from './BugSnagProvider'
import ErrorHandlerProvider, { ErrorHandlerProviderName } from './ErrorHandlerProvider'
import SentryProvider, { SentryConfig } from './SentryProvider'

export type ErrorConfig = BugSnagConfig | SentryConfig

export interface ErrorHandlerTypeConfig extends DriverConfig {
    driver: ErrorHandlerProviderName
}

export class ContextError extends Error {
    context?: Record<string, any>
}

export default class ErrorHandler {
    provider?: ErrorHandlerProvider
    constructor(config: ErrorConfig) {
        if (config?.driver === 'bugsnag') {
            this.provider = new BugSnagProvider(config)
        } else if (config?.driver === 'sentry') {
            this.provider = new SentryProvider(config)
        }
    }

    attach(api: Koa) {
        this.provider?.attach(api)
    }

    notify(error: Error, context?: Record<string, any>) {
        this.provider?.notify(
            error,
            error instanceof ContextError
                ? { ...context, ...error.context }
                : context,
        )
    }
}
