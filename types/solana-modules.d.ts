declare module '@solana/web3.js' {
  export class Connection {
    constructor(endpoint: string, commitment?: string | object);
    getBalance(publicKey: PublicKey): Promise<number>;
    getMinimumBalanceForRentExemption(size: number): Promise<number>;
    getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }>;
    confirmTransaction(signature: string, commitment?: string): Promise<{ value: { err: any } }>;
    sendRawTransaction(rawTransaction: Uint8Array): Promise<string>;
  }

  export class PublicKey {
    constructor(value: string | Uint8Array | number[] | Buffer);
    toString(): string;
    toBuffer(): Buffer;
    equals(publicKey: PublicKey): boolean;
    toBase58(): string;
  }

  export class Keypair {
    static generate(): Keypair;
    publicKey: PublicKey;
    secretKey: Uint8Array;
  }

  export class Transaction {
    constructor();
    add(...instructions: TransactionInstruction[]): Transaction;
    partialSign(keypair: Keypair): void;
    serialize(): Uint8Array;
    recentBlockhash?: string;
    feePayer?: PublicKey;
  }

  export class TransactionInstruction {
    constructor(options: {
      keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[];
      programId: PublicKey;
      data: Buffer;
    });
  }

  export const SystemProgram: {
    programId: PublicKey;
    createAccount(params: {
      fromPubkey: PublicKey;
      newAccountPubkey: PublicKey;
      lamports: number;
      space: number;
      programId: PublicKey;
    }): TransactionInstruction;
  };

  export function sendAndConfirmTransaction(
    connection: Connection,
    transaction: Transaction,
    signers: Keypair[],
    options?: any
  ): Promise<string>;

  export interface ConfirmOptions {
    commitment?: string;
    preflightCommitment?: string;
    skipPreflight?: boolean;
  }
}

declare module '@solana/spl-token' {
  import { Connection, PublicKey, TransactionInstruction, Transaction, Keypair } from '@solana/web3.js';

  export const TOKEN_PROGRAM_ID: PublicKey;
  export const MINT_SIZE: number;

  export function getMinimumBalanceForRentExemptMint(connection: Connection): Promise<number>;
  export function getMint(connection: Connection, publicKey: PublicKey): Promise<any>;
  export function createMint(
    connection: Connection,
    payer: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    decimals: number,
    keypair?: Keypair
  ): Promise<PublicKey>;

  export function createInitializeMintInstruction(
    mint: PublicKey,
    decimals: number,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    programId?: PublicKey
  ): TransactionInstruction;

  export function mintTo(
    connection: Connection,
    payer: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    },
    mint: PublicKey,
    destination: PublicKey,
    authority: PublicKey,
    amount: number | bigint
  ): TransactionInstruction;

  export function getOrCreateAssociatedTokenAccount(
    connection: Connection,
    payer: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
      sendTransaction?: (transaction: Transaction) => Promise<string>;
    },
    mint: PublicKey,
    owner: PublicKey
  ): Promise<{
    address: PublicKey;
    amount: number;
  }>;
}
