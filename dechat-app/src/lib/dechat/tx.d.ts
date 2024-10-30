// Generated by dedot cli

import type { GenericSubstrateApi } from "dedot/types";
import type {
  GenericContractTx,
  GenericContractTxCall,
  ContractTxOptions,
  ContractSubmittableExtrinsic,
} from "dedot/contracts";

export interface ContractTx<ChainApi extends GenericSubstrateApi>
  extends GenericContractTx<ChainApi> {
  /**
   *
   * @param {string} name
   * @param {ContractTxOptions} options
   *
   * @selector 0xcdb2bc30
   **/
  createRoom: GenericContractTxCall<
    ChainApi,
    (
      name: string,
      options: ContractTxOptions,
    ) => ContractSubmittableExtrinsic<ChainApi>
  >;

  /**
   *
   * @param {bigint} id
   * @param {ContractTxOptions} options
   *
   * @selector 0x9dad0b05
   **/
  joinRoom: GenericContractTxCall<
    ChainApi,
    (
      id: bigint,
      options: ContractTxOptions,
    ) => ContractSubmittableExtrinsic<ChainApi>
  >;

  /**
   *
   * @param {bigint} roomId
   * @param {string} content
   * @param {ContractTxOptions} options
   *
   * @selector 0xafdc403f
   **/
  sendMessage: GenericContractTxCall<
    ChainApi,
    (
      roomId: bigint,
      content: string,
      options: ContractTxOptions,
    ) => ContractSubmittableExtrinsic<ChainApi>
  >;
}
