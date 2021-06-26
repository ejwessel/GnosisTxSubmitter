const {ethers} = require("hardhat");
const {program} = require("commander");
const axios = require("axios");
const {default: EthersSafe} = require("@gnosis.pm/safe-core-sdk");

const TARGET_ADDRESS = "0x881D40237659C251811CEC9c364ef91dC08D300C";
const SAFE_ADDRESS = "0xBc50CBd395314a43302e3bf56677755E5a543a8C";
const TRX_SERVICE_URL = `https://safe-transaction.mainnet.gnosis.io/api/v1/safes/${SAFE_ADDRESS}/multisig-transactions/`;

program.version("0.0.1");
program
  .requiredOption(
    "-d, --data <items>",
    "data to submit to gnosis trx service",
    commaSeparatedList
  )
  .parse();
const options = program.opts();
const data = options.data;

// eslint-disable-next-line no-unused-vars
function commaSeparatedList(value, dummyPrevious) {
  return value.split(",");
}

function createTxs(dataArray) {
  const txs = [];
  dataArray.forEach((data) => {
    txs.push({
      to: TARGET_ADDRESS,
      data: data,
      value: "0",
    });
  });
  return txs;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const safeSdk = await EthersSafe.create({
    ethers,
    safeAddress: SAFE_ADDRESS,
    providerOrSigner: deployer,
  });
  const version = await safeSdk.getContractVersion();
  console.log(`Gnosis Contract Version: ${version.toString()}`);

  const txs = createTxs(data);
  const safeTransaction = await safeSdk.createTransaction(...txs);
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
    console.log(
      `https://gnosis-safe.io/app/#/safes/${TARGET_ADDRESS}/transactions`
    );
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
