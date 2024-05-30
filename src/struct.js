const BYTE_LENGTHS = {
  BigInt64: 8,
  BigUint64: 8,
  Float32: 4,
  Float64: 8,
  Int16: 2,
  Int32: 4,
  Int8: 1,
  Uint16: 2,
  Uint32: 4,
};

/**
 * @typedef {keyof typeof BYTE_LENGTHS} StructType
 */

/**
 * @template {Record<string, unknown>} Schema
 * @typedef {{ [Prop in keyof Schema]: number }} StructInstance
 */

/**
 * @template {Record<string, unknown>} Schema
 * @typedef {new (buffer: ArrayBuffer | SharedArrayBuffer, byteOffset: number) => StructInstance<Schema>} StructConstructor
 * @property {number} byteLength
 */

/**
 * @template {Record<string, StructType | { type: StructType, littleEndian?: boolean }>} Schema
 * @param {Schema} schema The schema of the struct, in a map of property names to types.
 * @return {StructConstructor<Schema>}
 *
 * @example
 * const NodeDatum = createStruct({
 *   x: "BigUint64",
 *   y: "BigUint64",
 *   vx: "Float64",
 *   vy: "Float64",
 *   fx: "Int32",
 *   fy: "Int32",
 * });
 *
 * const node = new NodeDatum(buffer, NodeDatum.byteLength * index);
 * node.x = 100n;
 * node.fx = 1;
 */
export function createStruct(schema) {
  class Struct {
    /**
     * @param {ArrayBuffer | SharedArrayBuffer} buffer
     * @param {number} byteOffset
     */
    constructor(buffer, byteOffset) {
      this.dataView = new DataView(buffer, byteOffset, Struct.byteLength);
    }
  }

  let offset = 0;
  for (const [name, type] of Object.entries(schema)) {
    let typeName;
    /** @type {boolean | undefined} */
    let littleEndian;
    if (typeof type === "string") {
      typeName = type;
    } else {
      typeName = type.type;
      littleEndian = type.littleEndian;
    }
    const offsetForProperty = offset;
    const byteLength = BYTE_LENGTHS[typeName];
    offset += byteLength;

    Object.defineProperty(Struct.prototype, name, {
      enumerable: true,
      get() {
        return this.dataView[`get${typeName}`](offsetForProperty, littleEndian);
      },
      set(value) {
        this.dataView[`set${typeName}`](offsetForProperty, value, littleEndian);
      },
    });
  }

  Struct.byteLength = offset;

  return Struct;
}
