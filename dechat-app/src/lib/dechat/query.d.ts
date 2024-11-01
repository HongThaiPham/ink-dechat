// Generated by dedot cli

import type { GenericSubstrateApi } from "dedot/types";
import type { Result } from "dedot/codecs";
import type {
  GenericContractQuery,
  GenericContractQueryCall,
  ContractCallOptions,
  GenericContractCallResult,
  ContractCallResult,
} from "dedot/contracts";
import type {
  DechatRoom,
  InkPrimitivesLangError,
  DechatError,
  DechatMessage,
} from "./types";

export interface ContractQuery<ChainApi extends GenericSubstrateApi>
  extends GenericContractQuery<ChainApi> {
  /**
   *
   * @param {bigint} id
   * @param {ContractCallOptions} options
   *
   * @selector 0x3f2d601a
   **/
  getRoom: GenericContractQueryCall<
    ChainApi,
    (
      id: bigint,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        DechatRoom | undefined,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {string} name
   * @param {ContractCallOptions} options
   *
   * @selector 0xcdb2bc30
   **/
  createRoom: GenericContractQueryCall<
    ChainApi,
    (
      name: string,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        Result<[], DechatError>,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {bigint} id
   * @param {ContractCallOptions} options
   *
   * @selector 0x9dad0b05
   **/
  joinRoom: GenericContractQueryCall<
    ChainApi,
    (
      id: bigint,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        Result<[], DechatError>,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {bigint} roomId
   * @param {string} content
   * @param {ContractCallOptions} options
   *
   * @selector 0xafdc403f
   **/
  sendMessage: GenericContractQueryCall<
    ChainApi,
    (
      roomId: bigint,
      content: string,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        Result<[], DechatError>,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {bigint} roomId
   * @param {bigint} messageId
   * @param {ContractCallOptions} options
   *
   * @selector 0x6373abe5
   **/
  getMessage: GenericContractQueryCall<
    ChainApi,
    (
      roomId: bigint,
      messageId: bigint,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        DechatMessage | undefined,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {bigint} roomId
   * @param {ContractCallOptions} options
   *
   * @selector 0x885a266d
   **/
  getMessageCount: GenericContractQueryCall<
    ChainApi,
    (
      roomId: bigint,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<bigint, ContractCallResult<ChainApi>>
    >
  >;

  /**
   *
   * @param {bigint} roomId
   * @param {bigint} from
   * @param {bigint} to
   * @param {ContractCallOptions} options
   *
   * @selector 0x9cdc4fe4
   **/
  getMessagePaginate: GenericContractQueryCall<
    ChainApi,
    (
      roomId: bigint,
      from: bigint,
      to: bigint,
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        Array<DechatMessage> | undefined,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {ContractCallOptions} options
   *
   * @selector 0x28cab106
   **/
  getRoomCount: GenericContractQueryCall<
    ChainApi,
    (
      options?: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<bigint, ContractCallResult<ChainApi>>
    >
  >;
}
