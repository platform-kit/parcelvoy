import { loadProvider } from '../ProviderRepository'
import { loadControllers } from '../ProviderService'
import LocalWebhookProvider from './LocalWebhookProvider'
import LoggerWebhookProvider from './LoggerWebhookProvider'
import WebhookChannel from './WebhookChannel'
import { WebhookProvider, WebhookProviderName } from './WebhookProvider'

const typeMap = {
    local: LocalWebhookProvider,
    logger: LoggerWebhookProvider,
}

export const providerMap = (record: { type: WebhookProviderName }): WebhookProvider => {
    return typeMap[record.type].fromJson(record)
}

export const loadWebhookChannel = async (providerId: number, projectId: number): Promise<WebhookChannel | undefined> => {
    const provider = await loadProvider(providerId, providerMap, projectId)
    if (!provider) return
    return new WebhookChannel(provider)
}

export const loadWebhookControllers = loadControllers(typeMap, 'webhook')
