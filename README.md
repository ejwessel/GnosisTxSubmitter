# Gnosis Trx Submitter

* https://docs.gnosis.io/safe/docs/tutorial_tx_service_initiate_sign/#sign
* https://github.com/gnosis/safe-core-sdk/tree/main/packages/safe-core-sdk

.env:

```
PRIVATE_KEY=<key>
INFURA_API_KEY=<key>
```

Run:

```
HARDHAT_NETWORK=mainnet node scripts/submit-to-gnosis.js -d <data>
```

This will then show up in the Gnosis UI
