import wallet from "./wallet";
import { ethers } from "ethers";

type TransferERC20= {
  success: boolean;
  message: string;
};

/*
 * Transfer token to address. This is an ERC20 token
 * @param {string} address - The address to transfer to
 */
export default async function transferERC20(address: string): Promise<TransferERC20> {
  try {
    const tokenAddress = "0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f";
    // prettier-ignore
    const abi = [ { inputs: [ { internalType: "address", name: "to", type: "address", }, { internalType: "uint256", name: "amount", type: "uint256", }, ], name: "transfer", outputs: [ { internalType: "bool", name: "", type: "bool", }, ], stateMutability: "nonpayable", type: "function", }, ];
    const contract = new ethers.Contract(tokenAddress, abi, wallet);
    const transaction = await contract.transfer(address, process.env.VALUE);
    console.log(transaction);
    return {
      success: true,
      message: transaction.hash,
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to Send Transaction",
    };
  }
}
