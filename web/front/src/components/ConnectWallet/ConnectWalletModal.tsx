import { FC, useEffect } from 'react';
import { useConnectors, useStarknet, useSignTypedData } from '@starknet-react/core'
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
    //const [signature, setSignature] = useState(null)

    const { data, signTypedData, loading } = useSignTypedData(getTypedMessage(account, 'alpha4.starknet.io'))

    const handleConnect = ((connector: any) => {
      if (isWalletConnected) {
        disconnect()
        close()
      } else {
        connect(connector)
      }
    })

    useEffect(() => {
        console.log(user)
        if (isWalletConnected && user.status === "disconnected") {
            console.log("Fetching User...")
            dispatch(fetchUser({
                "wallet_address": account
            }))
        }
    }, [isWalletConnected])


    useEffect(() => {
        //console.log(user)
        if (data && ~loading) {
            dispatch(registerUser({
                "wallet_address": account,
                "signature": data
            }))
            close()
        }
    }, [data])

    return (
        <div className="wallet-modal" style={{ display: open ? 'block' : 'none' }}>
            <div className="wallet-modal-content">
                {isWalletConnected ?
                    <>
                    <button onClick={signTypedData} className={buttonClass}>
                        {'Sign in Starklings'}
                    </button>
                    <button onClick={() => handleConnect(null)} className={buttonClass}>
                        {'Disconnect'}
                    </button>
                    </>
                : connectors.map((connector) =>
                    connector.available() &&
                    (
                        <button key={connector.id()} onClick={() => handleConnect(connector)} className={buttonClass}>
                            {'Connect with '+connector.name()}
                        </button>
                    )
                )}
            </div>
        </div>
    );
  }
  
  export default ConnectWalletModal;