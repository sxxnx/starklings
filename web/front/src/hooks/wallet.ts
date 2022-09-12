import { TypedData } from 'starknet/dist/utils/typedData'

const getChainId = (providerUrl: string) => {
  if (providerUrl.includes('alpha-mainnet.starknet.io')) {
    return 0
  } else if (providerUrl.includes('alpha4.starknet.io')) {
    return 1
  }
  return 2
}

export const getTypedMessage = (wallet: string | undefined, providerBaseUrl: string): TypedData => {
  const typed: TypedData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      StarklingsUser: [
        { name: 'content', type: 'felt' },
        { name: 'wallet', type: 'felt' }
      ]
    },
    domain: {
      name: 'Starklings App',
      chainId: getChainId(providerBaseUrl),
      version: '1'
    },
    primaryType: 'StarklingsUser',
    message: {
      content: 'Register to Starklings',
      wallet: wallet
    }
  }
  return typed
}
