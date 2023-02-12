import { PropsWithChildren } from 'react'
import './Alert.css'

interface AlertProps extends PropsWithChildren {
    variant?: 'info' | 'plain' | 'success' | 'error' | 'warn'
    title: React.ReactNode
    body?: React.ReactNode
    actions?: React.ReactNode
}

export default function Alert(props: AlertProps) {
    return (
        <div className={`ui-alert ${props.variant ?? 'info'}`}>
            <h4>{props.title}</h4>
            <p className="alert-body">{props.body ?? props.children}</p>
            {props.actions && <div className="alert-actions">{props.actions}</div>}
        </div>
    )
}
