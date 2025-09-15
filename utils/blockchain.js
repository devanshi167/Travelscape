import { ethers } from "ethers";

const RPC_URL = "http://10.0.2.2:8545"; // ⚠️ use LAN IP or emulator IP
const REGISTRY_ADDR = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // from Hardhat deploy

const abi = [
  "function anchor(bytes32 vcHash) external",
  "function isAnchored(bytes32 vcHash) external view returns (bool,uint256)"
];

export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 private key
  provider
);

export const registry = new ethers.Contract(REGISTRY_ADDR, abi, wallet);
