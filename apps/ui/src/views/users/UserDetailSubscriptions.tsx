import { useCallback, useContext } from 'react'
import api from '../../api'
import { ProjectContext, UserContext } from '../../contexts'
import { useResolver } from '../../hooks'
import { SubscriptionParams, SubscriptionState } from '../../types'
import Button from '../../ui/Button'
import SwitchField from '../../ui/form/SwitchField'
import Heading from '../../ui/Heading'
import { SearchTable, useTableSearchParams } from '../../ui/SearchTable'
import { snakeToTitle } from '../../utils'

export default function UserDetailSubscriptions() {
    const [project] = useContext(ProjectContext)
    const [user] = useContext(UserContext)
    const [params, setParams] = useTableSearchParams()

    const [search, _, reload] = useResolver(useCallback(async () => await api.users.subscriptions(project.id, user.id, params), [api.users, project, params]))

    const updateSubscription = async (subscription_id: number, state: SubscriptionState) => {
        if (!confirm('Are you sure you want to change the status of this subscription?')) return
        await updateSubscriptions([{ subscription_id, state }])
    }

    const unsubscribeAll = async () => {
        if (!confirm('Are you sure you want to unsubscribe from all?')) return
        const subscriptions = search?.results.map(item => ({
            subscription_id: item.subscription_id,
            state: 0,
        })) ?? []
        await updateSubscriptions(subscriptions)
    }

    const updateSubscriptions = async (subscriptions: SubscriptionParams[]) => {
        await api.users.updateSubscriptions(project.id, user.id, subscriptions)
        await reload()
    }

    return <>
        <Heading
            size="h3"
            title="Subscriptions"
            actions={
                <Button
                    size="small"
                    onClick={async () => await unsubscribeAll()}
                >
                    Unsubscribe From All
                </Button>
            }
        />
        <SearchTable
            results={search}
            params={params}
            setParams={setParams}
            itemKey={({ item }) => item.id}
            columns={[
                {
                    key: 'channel',
                    cell: ({ item: { channel } }) => snakeToTitle(channel),
                },
                { key: 'name' },
                { key: 'updated_at', title: 'Last Modified At' },
                {
                    key: 'state',
                    title: 'Subscribed',
                    cell: ({ item: { subscription_id, state } }) => {
                        return (
                            <SwitchField
                                name="state"
                                checked={state !== 0}
                                onChange={async (checked) => await updateSubscription(subscription_id, checked ? 1 : 0)}
                            />
                        )
                    },
                },
            ]}
        />
    </>
}
