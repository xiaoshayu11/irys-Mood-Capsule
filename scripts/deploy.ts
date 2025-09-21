import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers found. Please check your private key configuration.");
  }
  
  const deployer = signers[0];
  console.log("Deploying contracts with the account:", deployer.address);

  const factory = await ethers.getContractFactory("OnChainDiary");
  const contract = await factory.connect(deployer).deploy();
  await contract.waitForDeployment();

  console.log("OnChainDiary deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



