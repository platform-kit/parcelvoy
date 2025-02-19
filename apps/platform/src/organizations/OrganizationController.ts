import Router from '@koa/router'
import { JSONSchemaType, validate } from '../core/validate'
import App from '../app'
import { Context } from 'koa'
import { JwtAdmin } from '../auth/AuthMiddleware'
import { getOrganization, organizationIntegrations, updateOrganization } from './OrganizationService'
import Organization, { OrganizationParams } from './Organization'
import { jobs } from '../config/queue'

const router = new Router<{
    admin: JwtAdmin
    organization: Organization
}>({
    prefix: '/organizations',
})

router.use(async (ctx: Context, next: () => void) => {
    ctx.state.organization = await getOrganization(ctx.state.admin.organization_id)
    return next()
})

router.get('/', async ctx => {
    ctx.body = ctx.state.organization
})

router.get('/performance/queue', async ctx => {
    ctx.body = await App.main.queue.metrics()
})

router.get('/performance/jobs', async ctx => {
    ctx.body = jobs.map(job => job.$name)
})

router.get('/performance/jobs/:job', async ctx => {
    ctx.body = await App.main.stats.list(ctx.params.job)
})

router.get('/integrations', async ctx => {
    ctx.body = await organizationIntegrations(ctx.state.organization)
})

const organizationUpdateParams: JSONSchemaType<OrganizationParams> = {
    $id: 'organizationUpdate',
    type: 'object',
    required: ['username'],
    properties: {
        username: { type: 'string' },
        domain: {
            type: 'string',
            nullable: true,
        },
        tracking_deeplink_mirror_url: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
}
router.patch('/:id', async ctx => {
    const payload = validate(organizationUpdateParams, ctx.request.body)
    ctx.body = await updateOrganization(ctx.state.organization, payload)
})

export default router
