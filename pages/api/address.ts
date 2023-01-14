// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import wallet from "../../src/wallet";

type Address = {
  address: string;
};

/*
 * Get the address of the wallet funding the faucet
 * @returns {Address} - The address of the wallet funding the faucet
 * @example curl http://localhost:3000/api/address
 * response: {"address": "0x123"}
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Address>) {
  const address = await wallet.getAddress();
  res.status(200).json({ address });
}
