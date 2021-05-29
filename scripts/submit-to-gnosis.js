const {ethers} = require("hardhat");
const {program} = require("commander");
const axios = require("axios");
const {default: EthersSafe} = require("@gnosis.pm/safe-core-sdk");

const TARGET_ADDRESS = "0x881D40237659C251811CEC9c364ef91dC08D300C";
const SAFE_ADDRESS = "0xBc50CBd395314a43302e3bf56677755E5a543a8C";
const TRX_SERVICE_URL = `https://safe-transaction.mainnet.gnosis.io/api/v1/safes/${SAFE_ADDRESS}/multisig-transactions/`;

program.version("0.0.1");
program
  .requiredOption("-d, --data <string>", "data to submit to gnosis trx service")
  .parse();
const options = program.opts();
const data = options.data;

async function main() {
  const [deployer] = await ethers.getSigners();
  const safeSdk = await EthersSafe.create(ethers, SAFE_ADDRESS, deployer);
  const version = await safeSdk.getContractVersion();
  console.log(`Gnosis Contract Version: ${version.toString()}`);

  const tx = {
    to: TARGET_ADDRESS,
    data: data,
    value: "0",
  };
  const safeTransaction = await safeSdk.createTransaction(tx);
  const trxHash = await safeSdk.getTransactionHash(safeTransaction);
  const signatureData = await safeSdk.signTransactionHash(trxHash);
  const {signer: sender, data: signature} = signatureData;

  const postData = {
    ...safeTransaction.data,
    contractTransactionHash: trxHash,
    sender,
    signature,
    origin: "Submit Data",
  };
  console.log(postData);
  try {
    await axios.post(TRX_SERVICE_URL, postData);
    console.log("Submitted Transaction");
  } catch (e) {
    console.error(e.response.status);
    console.error(e.response.statusText);
    console.error(e.response.data);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
