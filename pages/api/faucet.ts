// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { verify } from "hcaptcha";
import canRecieve from "../../src/canRecieve";
import transferCoin from "../../src/transferCoin";
import redis from "../../src/redis";

type Message = {
  message: string;
};

/*
 * Transfer coin to address. This is native token ie ETH
 * @param {string} address - The address to transfer to
 * @param {string} hcaptchaToken - The token from the hcaptcha
 * @returns {Message} - The message to display to the user, either error message or transaction hash
 * @example curl -X POST -H "Content-Type: application/json" -d '{"address": "0x123", "hcaptchaToken": "123"}' http://localhost:3000/api/faucet
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  // parse the request body
  const { address, hcaptchaToken } = JSON.parse(req.body);
  // verify address
  const isAddress = ethers.utils.isAddress(address);
  // if invalid address
  if (!isAddress) return res.status(400).json({ message: "Invalid Address" });
  // verify the captcha
  const verified = await verify(process.env.HCAPTCHA_SECRET as string, hcaptchaToken);
  // if invalid captcha, return 401
  if (!verified.success) return res.status(401).json({ message: "Invalid Captcha" });
  // if cooldown is enough to recieve funds
  const recieved = await canRecieve(address);
  // if not enough time has passed
  if (!recieved.success) return res.status(400).json({ message: recieved.message });
  // transfer coin
  const transfer = await transferCoin(address);
  // if transfer was unsuccessful
  if (!transfer.success) return res.status(400).json({ message: transfer.message });
  // update the last transfer timestamp to now
  await redis.set(address, Math.floor(Date.now() / 1000));
  // transfer is successful
  return res.status(200).json({ message: transfer.message });
}
