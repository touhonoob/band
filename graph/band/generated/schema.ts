// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get decimals(): i32 {
    let value = this.get("decimals");
    return value.toI32();
  }

  set decimals(value: i32) {
    this.set("decimals", Value.fromI32(value));
  }

  get curve(): string | null {
    let value = this.get("curve");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set curve(value: string | null) {
    if (value === null) {
      this.unset("curve");
    } else {
      this.set("curve", Value.fromString(value as string));
    }
  }

  get parameter(): string | null {
    let value = this.get("parameter");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set parameter(value: string | null) {
    if (value === null) {
      this.unset("parameter");
    } else {
      this.set("parameter", Value.fromString(value as string));
    }
  }

  get tcd(): string | null {
    let value = this.get("tcd");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tcd(value: string | null) {
    if (value === null) {
      this.unset("tcd");
    } else {
      this.set("tcd", Value.fromString(value as string));
    }
  }
}

export class Balance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Balance entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Balance entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Balance", id.toString(), this);
  }

  static load(id: string): Balance | null {
    return store.get("Balance", id) as Balance | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    return value.toBytes();
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }

  get lockedValue(): BigInt {
    let value = this.get("lockedValue");
    return value.toBigInt();
  }

  set lockedValue(value: BigInt) {
    this.set("lockedValue", Value.fromBigInt(value));
  }
}

export class TokenLocked extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokenLocked entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokenLocked entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokenLocked", id.toString(), this);
  }

  static load(id: string): TokenLocked | null {
    return store.get("TokenLocked", id) as TokenLocked | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get locker(): Bytes {
    let value = this.get("locker");
    return value.toBytes();
  }

  set locker(value: Bytes) {
    this.set("locker", Value.fromBytes(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    return value.toBytes();
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }
}

export class Curve extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Curve entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Curve entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Curve", id.toString(), this);
  }

  static load(id: string): Curve | null {
    return store.get("Curve", id) as Curve | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get collateralEquation(): Bytes {
    let value = this.get("collateralEquation");
    return value.toBytes();
  }

  set collateralEquation(value: Bytes) {
    this.set("collateralEquation", Value.fromBytes(value));
  }

  get curveMultiplier(): BigInt {
    let value = this.get("curveMultiplier");
    return value.toBigInt();
  }

  set curveMultiplier(value: BigInt) {
    this.set("curveMultiplier", Value.fromBigInt(value));
  }
}

export class Price extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Price entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Price entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Price", id.toString(), this);
  }

  static load(id: string): Price | null {
    return store.get("Price", id) as Price | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Order extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Order entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Order entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Order", id.toString(), this);
  }

  static load(id: string): Order | null {
    return store.get("Order", id) as Order | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Transfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transfer", id.toString(), this);
  }

  static load(id: string): Transfer | null {
    return store.get("Transfer", id) as Transfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Parameter extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Parameter entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Parameter entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Parameter", id.toString(), this);
  }

  static load(id: string): Parameter | null {
    return store.get("Parameter", id) as Parameter | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Proposal entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Proposal entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Proposal", id.toString(), this);
  }

  static load(id: string): Proposal | null {
    return store.get("Proposal", id) as Proposal | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class ProposalVote extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ProposalVote entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ProposalVote entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ProposalVote", id.toString(), this);
  }

  static load(id: string): ProposalVote | null {
    return store.get("ProposalVote", id) as ProposalVote | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class TCD extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TCD entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TCD entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TCD", id.toString(), this);
  }

  static load(id: string): TCD | null {
    return store.get("TCD", id) as TCD | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get prefix(): string {
    let value = this.get("prefix");
    return value.toString();
  }

  set prefix(value: string) {
    this.set("prefix", Value.fromString(value));
  }

  get maxProviderCount(): i32 {
    let value = this.get("maxProviderCount");
    return value.toI32();
  }

  set maxProviderCount(value: i32) {
    this.set("maxProviderCount", Value.fromI32(value));
  }

  get minStake(): BigInt | null {
    let value = this.get("minStake");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set minStake(value: BigInt | null) {
    if (value === null) {
      this.unset("minStake");
    } else {
      this.set("minStake", Value.fromBigInt(value as BigInt));
    }
  }

  get queryCount(): i32 {
    let value = this.get("queryCount");
    return value.toI32();
  }

  set queryCount(value: i32) {
    this.set("queryCount", Value.fromI32(value));
  }

  get reportCount(): i32 {
    let value = this.get("reportCount");
    return value.toI32();
  }

  set reportCount(value: i32) {
    this.set("reportCount", Value.fromI32(value));
  }
}

export class QueryCounter extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save QueryCounter entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save QueryCounter entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("QueryCounter", id.toString(), this);
  }

  static load(id: string): QueryCounter | null {
    return store.get("QueryCounter", id) as QueryCounter | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): Bytes {
    let value = this.get("contract");
    return value.toBytes();
  }

  set contract(value: Bytes) {
    this.set("contract", Value.fromBytes(value));
  }

  get startTime(): BigInt {
    let value = this.get("startTime");
    return value.toBigInt();
  }

  set startTime(value: BigInt) {
    this.set("startTime", Value.fromBigInt(value));
  }

  get query(): i32 {
    let value = this.get("query");
    return value.toI32();
  }

  set query(value: i32) {
    this.set("query", Value.fromI32(value));
  }
}

export class Report extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Report entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Report entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Report", id.toString(), this);
  }

  static load(id: string): Report | null {
    return store.get("Report", id) as Report | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): Bytes {
    let value = this.get("contract");
    return value.toBytes();
  }

  set contract(value: Bytes) {
    this.set("contract", Value.fromBytes(value));
  }

  get key(): Bytes {
    let value = this.get("key");
    return value.toBytes();
  }

  set key(value: Bytes) {
    this.set("key", Value.fromBytes(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get status(): i32 {
    let value = this.get("status");
    return value.toI32();
  }

  set status(value: i32) {
    this.set("status", Value.fromI32(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}

export class DataProvider extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save DataProvider entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save DataProvider entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("DataProvider", id.toString(), this);
  }

  static load(id: string): DataProvider | null {
    return store.get("DataProvider", id) as DataProvider | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get dataProviderOwnerships(): string {
    let value = this.get("dataProviderOwnerships");
    return value.toString();
  }

  set dataProviderOwnerships(value: string) {
    this.set("dataProviderOwnerships", Value.fromString(value));
  }

  get dataSourceAddress(): Bytes {
    let value = this.get("dataSourceAddress");
    return value.toBytes();
  }

  set dataSourceAddress(value: Bytes) {
    this.set("dataSourceAddress", Value.fromBytes(value));
  }

  get detail(): string | null {
    let value = this.get("detail");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set detail(value: string | null) {
    if (value === null) {
      this.unset("detail");
    } else {
      this.set("detail", Value.fromString(value as string));
    }
  }

  get endpoint(): string | null {
    let value = this.get("endpoint");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set endpoint(value: string | null) {
    if (value === null) {
      this.unset("endpoint");
    } else {
      this.set("endpoint", Value.fromString(value as string));
    }
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get stake(): BigInt {
    let value = this.get("stake");
    return value.toBigInt();
  }

  set stake(value: BigInt) {
    this.set("stake", Value.fromBigInt(value));
  }

  get status(): string {
    let value = this.get("status");
    return value.toString();
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get tcdAddress(): Bytes {
    let value = this.get("tcdAddress");
    return value.toBytes();
  }

  set tcdAddress(value: Bytes) {
    this.set("tcdAddress", Value.fromBytes(value));
  }

  get tcd(): string {
    let value = this.get("tcd");
    return value.toString();
  }

  set tcd(value: string) {
    this.set("tcd", Value.fromString(value));
  }

  get totalOwnership(): BigInt {
    let value = this.get("totalOwnership");
    return value.toBigInt();
  }

  set totalOwnership(value: BigInt) {
    this.set("totalOwnership", Value.fromBigInt(value));
  }
}

export class DataProviderOwnership extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save DataProviderOwnership entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save DataProviderOwnership entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("DataProviderOwnership", id.toString(), this);
  }

  static load(id: string): DataProviderOwnership | null {
    return store.get(
      "DataProviderOwnership",
      id
    ) as DataProviderOwnership | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get dataProvider(): string {
    let value = this.get("dataProvider");
    return value.toString();
  }

  set dataProvider(value: string) {
    this.set("dataProvider", Value.fromString(value));
  }

  get dataSourceAddress(): Bytes {
    let value = this.get("dataSourceAddress");
    return value.toBytes();
  }

  set dataSourceAddress(value: Bytes) {
    this.set("dataSourceAddress", Value.fromBytes(value));
  }

  get ownership(): BigInt {
    let value = this.get("ownership");
    return value.toBigInt();
  }

  set ownership(value: BigInt) {
    this.set("ownership", Value.fromBigInt(value));
  }

  get tcdAddress(): Bytes {
    let value = this.get("tcdAddress");
    return value.toBytes();
  }

  set tcdAddress(value: Bytes) {
    this.set("tcdAddress", Value.fromBytes(value));
  }

  get tokenLock(): BigInt {
    let value = this.get("tokenLock");
    return value.toBigInt();
  }

  set tokenLock(value: BigInt) {
    this.set("tokenLock", Value.fromBigInt(value));
  }

  get voter(): Bytes {
    let value = this.get("voter");
    return value.toBytes();
  }

  set voter(value: Bytes) {
    this.set("voter", Value.fromBytes(value));
  }
}
