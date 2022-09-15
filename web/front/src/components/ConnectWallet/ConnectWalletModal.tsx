import { FC, useEffect } from 'react';
import { useConnectors, useStarknet, useSignTypedData, Connector } from '@starknet-react/core'
import { getMessageHash } from 'starknet/dist/utils/typedData'
import { getTypedMessage } from '../../hooks/wallet'

//API
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../store/store'
import { fetchUser, registerUser, UserState } from '../../store/reducers/user'


interface Props {
    open: boolean;
    close: () => void;
    buttonClass: string;
}

const ConnectWalletModal: FC<Props> = ({ open, close, buttonClass }: Props) => {
    const { connect, disconnect, connectors } = useConnectors()
    const { account } = useStarknet()
    const user = useSelector<RootState, UserState>(state => state.user)
    const dispatch = useAppDispatch()
    const isWalletConnected = (account !== undefined && account !== null && account.length > 0)
    const { data, signTypedData, loading } = useSignTypedData(getTypedMessage(account, 'alpha4.starknet.io'))

    const connectWallet = ((connector: any) => {
        connect(connector)
    })
    
    const disconnectWallet = (() => {
        disconnect()
        close()
    })

    useEffect(() => {
        if (isWalletConnected && user.status === "disconnected") {
            console.log("Fetching User...")
            dispatch(fetchUser({
                "wallet_address": account
            }))
        }
    }, [isWalletConnected])


    useEffect(() => {
        if (data && !loading) {
            const hash = getMessageHash(getTypedMessage(account, 'alpha4.starknet.io'), account)
            dispatch(registerUser({
                "wallet_address": account,
                "signature": data,
                "hash": hash
            }))
            close()
        }
    }, [data])

    return (
        <div className="wallet-modal" style={{ display: open ? 'block' : 'none' }}>
            <div className="wallet-modal-content">
                {isWalletConnected ?
                    renderConnectedWalletModal(signTypedData, disconnectWallet, buttonClass)
                    : 
                    renderConnectWalletModal(connectors, connectWallet, buttonClass)
                }
            </div>
        </div>
    );
  }

function renderConnectedWalletModal(signTypedData: Function, disconnect: Function, buttonClass: string) {
    return (
        <>
            <button onClick={() => signTypedData()} className={buttonClass}>
                {'Sign in Starklings'}
            </button>
            <button onClick={() => disconnect()} className={buttonClass}>
                {'Disconnect'}
            </button>
        </>
    )
}

function renderConnectWalletModal(connectors: Array<Connector>, connect: Function, buttonClass: string) {

    return (
        connectors.map((connector) => connector.available() &&
            (
                <button key={connector.id()} onClick={() => connect(connector)} className={buttonClass}>
                    {'Connect with '+connector.name()}
                </button>
            )
    ))
}
  
export default ConnectWalletModal;