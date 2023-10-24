import { ethers } from 'ethers'

import { 
	setProvider, 
	setNetwork, 
	setAccount 
} from './reducers/provider'

import {
	setContracts,
	setSymbols,
	balancesLoaded
} from './reducers/tokens'

import {
	setContract
} from './reducers/amm'


// ABIs: Import your contract ABIs here
import TOKEN_ABI from '../abis/Token.json'
import AMM_ABI from '../abis/AMM.json'

// Config: Import your network config here
import config from '../config.json';

export const loadProvider = (dispatch) =>{
	// Initiate provider
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	dispatch(setProvider(provider))

	return provider

}

export const loadNetwork = async (provider, dispatch) =>{
	//Get network
	const { chainId } = await provider.getNetwork()
	dispatch(setNetwork(chainId))

	return chainId

}


export const loadAccount = async (dispatch) => {
	// Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account
}


//////////
// Load contracts
//////////

export const loadTokens = async (provider, chainId, dispatch) => {
	const dapp = new ethers.Contract(config[chainId].dapp.address, TOKEN_ABI, provider)
	const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)

	dispatch(setContracts([dapp, usd]))
	dispatch(setSymbols([await dapp.symbol(), await usd.symbol()]))

}

export const loadAMM = async (provider, chainId, dispatch) => {
	const amm = new ethers.Contract(config[chainId].amm.address, AMM_ABI, provider)

	dispatch(setContract(amm))

	return amm

}

//////////
// Load balances & shares
//////////
export const loadBalances = async (tokens, account, dispatch) => {
	const balance1 = await tokens[0].balanceOf(account)
	const balance2 = await tokens[1].balanceOf(account)

	dispatch(balancesLoaded(
		balance1,
		balance2
	))
}
