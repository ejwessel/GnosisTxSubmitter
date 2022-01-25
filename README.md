# Gnosis Tx Submitter

* https://docs.gnosis-safe.io/tutorials/tutorial_tx_service_initiate_sign
* https://github.com/gnosis/safe-core-sdk/tree/main/packages/safe-core-sdk

.env:

```
PRIVATE_KEY=<key>
INFURA_API_KEY=<key>
```

Options:
```
  -V, --version         output the version number
  -d, --data <items>    data to submit to gnosis trx service
  -t --target <string>  target contract address the safe will submit data against
  -s --safe <string>    safe address to submit transaction to
  -n --nonce <number>   (optional) custom nonce to submit
  -h, --help            display help for command
```

Run:

```
HARDHAT_NETWORK=mainnet node scripts/submit-to-gnosis.js -d <data> -s <safeAddress> -t <targetAddress>
```

This will then show up in the Gnosis UI
