import { useCall, useCalls, useEthers } from "@usedapp/core"
import { constants, Contract, utils } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useState } from "react"
import axios from "axios"
// import { networks } from "../helper-config.json"
import contractAddresses from "../chain-info/deployments/map.json"
import SavvyFinanceFarm from "../chain-info/contracts/SavvyFinanceFarm.json"

export type TokenData = {
    name: string
    type: number
    balance: number
    stakeFee: number
    unstakeFee: number
    stakingApr: number
    rewardToken: string
    admin: string
}

export const useContract = (): Contract => {
    const { chainId } = useEthers()

    // const networkName = chainId ? networks[String(chainId)] : "bsc-test"
    const svfFarmAddress = chainId ? contractAddresses[String(chainId)]["TransparentUpgradeableProxy"][0]
        : constants.AddressZero
    const svfFarmInterface = new utils.Interface(SavvyFinanceFarm.abi)

    return new Contract(svfFarmAddress, svfFarmInterface)
}

export const useTokens = (): string[] => {
    var tokens: string[] = []

    const contract = useContract()
    const { value, error } = useCall({
        contract: contract,
        method: 'getTokens',
        args: []
    }) ?? {}

    if (value) tokens = value[0]
    if (error) console.error(error.message)

    return tokens
}

export const useTokensAreActive = (tokensAddresses: string[]): boolean[] => {
    var tokensAreActive: boolean[] = []

    const contract = useContract()
    const calls = tokensAddresses.map(tokenAddress => ({
        contract: contract,
        method: 'tokenIsActive',
        args: [tokenAddress]
    })) ?? []
    const results = useCalls(calls) ?? []

    results.forEach((result, index) => {
        if (result?.value) tokensAreActive[index] = result.value[0]
        if (result?.error) console.error(tokensAddresses[index], result.error.message)
    })

    return tokensAreActive
}

export const useTokensData = (tokensAddresses: string[]): TokenData[] | [] => {
    var tokensData: TokenData[] | [] = [];

    const contract = useContract()
    const calls = tokensAddresses.map(tokenAddress => ({
        contract: contract,
        method: 'tokensData',
        args: [tokenAddress]
    })) ?? []
    const results = useCalls(calls) ?? []

    results.forEach((result, index) => {
        if (result?.value) {
            const name = result.value["name"]
            const type = parseInt(formatEther(result.value["_type"]))
            const balance = parseFloat(formatEther(result.value["balance"]))
            const stakeFee = parseInt(formatEther(result.value["stakeFee"]))
            const unstakeFee = parseInt(formatEther(result.value["unstakeFee"]))
            const stakingApr = parseInt(formatEther(result.value["stakingApr"]))
            const rewardToken = result.value["rewardToken"]
            const admin = result.value["admin"]
            tokensData[index] = {
                name: name, type: type, balance: balance,
                stakeFee: stakeFee, unstakeFee: unstakeFee,
                stakingApr: stakingApr, rewardToken: rewardToken,
                admin: admin
            }
        }
        if (result?.error) console.error(tokensAddresses[index], result.error.message)
    })

    return tokensData
}


export const useTokensPrices = (tokensAddresses: string[]): number[] => {
    const [tokensPrices, setTokensPrices] = useState<number[]>([])

    tokensAddresses.forEach((tokenAddress, index) => {
        if (tokenAddress !== undefined) (async () => {
            try {
                const response = await axios.get(
                    `https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`
                )
                if (response.data.data.price) setTokensPrices(tokensPrices => {
                    tokensPrices[index] = response.data.data.price
                    return tokensPrices
                })
            } catch (error) { console.error(error) }
        }
        )()
    })

    return tokensPrices
}