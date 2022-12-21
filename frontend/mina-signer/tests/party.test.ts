import Client from "../src/MinaSigner";
import type { ZkappCommand, Signed } from "../src/TSTypes";

/**
 * This is an example of a zkapp command transaction. This can be generated by
 * creating a transaction in SnarkyJS and printing it out as JSON.
 *
 * TODO: When there is an example of how to do this in the SnarkyJS repo,
 * use that example instead.
 */
let mockedZkappCommand = {
  accountUpdates: [
    {
      body: {
        publicKey: "B62qieh9a3U8Z4s8c3DHhCyDECqyZLyRtGA5GBDMqqi6Lf1gaHX4hLt",
        tokenId: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
        update: {
          appState: ["10", null, null, null, null, null, null, null],
          delegate: null,
          verificationKey: null,
          permissions: {
            editState: "Proof",
            send: "Signature",
            receive: "Proof",
            setDelegate: "Signature",
            setPermissions: "Signature",
            setVerificationKey: "Signature",
            setZkappUri: "Signature",
            editSequenceState: "Proof",
            setTokenSymbol: "Signature",
            incrementNonce: "Signature",
            setVotingFor: "Signature",
          },
          zkappUri: null,
          tokenSymbol: null,
          timing: null,
          votingFor: null,
        },
        balanceChange: { magnitude: "0", sgn: "Positive" },
        incrementNonce: false,
        events: [],
        actions: [],
        callData: "0",
        callDepth: 0,
        preconditions: {
          network: {
            snarkedLedgerHash: null,
            blockchainLength: { lower: "0", upper: "4294967295" },
            minWindowDensity: { lower: "0", upper: "4294967295" },
            totalCurrency: { lower: "0", upper: "18446744073709551615" },
            globalSlotSinceGenesis: { lower: "0", upper: "4294967295" },
            stakingEpochData: {
              ledger: {
                hash: null,
                totalCurrency: { lower: "0", upper: "18446744073709551615" },
              },
              seed: null,
              startCheckpoint: null,
              lockCheckpoint: null,
              epochLength: { lower: "0", upper: "4294967295" },
            },
            nextEpochData: {
              ledger: {
                hash: null,
                totalCurrency: { lower: "0", upper: "18446744073709551615" },
              },
              seed: null,
              startCheckpoint: null,
              lockCheckpoint: null,
              epochLength: { lower: "0", upper: "4294967295" },
            },
          },
          account: {
            balance: { lower: "0", upper: "18446744073709551615" },
            nonce: { lower: "0", upper: "4294967295" },
            receiptChainHash: null,
            publicKey: null,
            delegate: null,
            state: [null, null, null, null, null, null, null, null],
            sequenceState: null,
            provedState: null,
            isNew: null,
          },
        },

        useFullCommitment: true,
        implicitAccountCreationFee: false,
        caller: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
        authorizationKind: "Signature",
      },
      authorization: {
        proof: null,
        signature:
          "7mX5N5V5mW1HtH6X2bVNadxkqQLtSyDDsp8RSgWxCwweAy2mjjuifxRMcpFNnyru2LerpNtkxrHmHCczyS8uqHpQQXQUzgNF",
      },
    },
  ],
  memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
};
describe("ZkappCommand", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ network: "mainnet" });
  });

  it("generates a signed zkapp command", () => {
    const keypair = client.genKeys();
    const zkappCommand = client.signZkappCommand(
      {
        zkappCommand: mockedZkappCommand,
        feePayer: {
          feePayer: keypair.publicKey,
          fee: "1",
          nonce: "0",
          memo: "test memo",
        },
      },
      keypair.privateKey
    );
    expect(zkappCommand.data).toBeDefined();
    expect(zkappCommand.signature).toBeDefined();
  });

  it("generates a signed accountUpdate by using signTransaction", () => {
    const keypair = client.genKeys();
    const zkappCommand = client.signTransaction(
      {
        zkappCommand: mockedZkappCommand,
        feePayer: {
          feePayer: keypair.publicKey,
          fee: "1",
          nonce: "0",
          memo: "test memo",
        },
      },
      keypair.privateKey
    ) as Signed<ZkappCommand>;
    expect(zkappCommand.data).toBeDefined();
    expect(zkappCommand.signature).toBeDefined();
  });

  it("should throw an error if no fee is passed to the feePayer", () => {
    const keypair = client.genKeys();
    expect(() => {
      client.signZkappCommand(
        {
          zkappCommand: mockedZkappCommand,
          // @ts-ignore - fee is not defined
          feePayer: {
            feePayer: keypair.publicKey,
            nonce: "0",
            memo: "test memo",
          },
        },
        keypair.privateKey
      );
    }).toThrowError("Fee must be greater than 0.001");
  });

  it("should calculate a correct minimum fee", () => {
    expect(
      client.getAccountUpdateMinimumFee(mockedZkappCommand.accountUpdates, 1)
    ).toBe(1);
  });
});
