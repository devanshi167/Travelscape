import CryptoJS from "crypto-js";
import { registry } from "./blockchain";

// 🔹 Create Aadhaar token safely
export function createAadhaarToken(referenceId) {
  const salt = process.env.EXPO_PUBLIC_AADHAAR_SALT || "demo-salt"; 
  // ⚠️ Replace "demo-salt" with a strong random string in .env
  return CryptoJS.SHA256(salt + "|" + referenceId).toString();
}

// 🔹 Build Verifiable Credential
export function buildVC(user) {
  const aadhaar_token = createAadhaarToken(user.aadharNumber);

  return {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential", "TravelScapeID"],
    "issuer": "did:travelscape:issuer1",
    "issuanceDate": new Date().toISOString(),
    "credentialSubject": {
      id: "did:travelscape:" + user.email,
      name: user.name,
      country: "IN",
      aadhaar_token,
      email: user.email,
      contactNumber: user.contactNumber,
      age: user.age,
      gender: user.gender,
      address: user.address
    }
  };
}

// 🔹 Anchor a VC hash on blockchain
export async function anchorVC(vc) {
  const vcHash = "0x" + CryptoJS.SHA256(JSON.stringify(vc)).toString();
  const tx = await registry.anchor(vcHash);
  await tx.wait();
  return vcHash;
}

// 🔹 Verify VC hash on blockchain
export async function verifyVC(vc) {
  const vcHash = "0x" + CryptoJS.SHA256(JSON.stringify(vc)).toString();
  const [ok, ts] = await registry.isAnchored(vcHash);
  return { ok, ts: Number(ts) };
}
