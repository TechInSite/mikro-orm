"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.UnknownType = exports.TextType = exports.UuidType = exports.StringType = exports.DecimalType = exports.BooleanType = exports.DoubleType = exports.FloatType = exports.TinyIntType = exports.SmallIntType = exports.IntegerType = exports.JsonType = exports.EnumType = exports.EnumArrayType = exports.ArrayType = exports.BlobType = exports.BigIntType = exports.DateTimeType = exports.TimeType = exports.DateType = exports.Type = void 0;
const Type_1 = require("./Type");
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return Type_1.Type; } });
const DateType_1 = require("./DateType");
Object.defineProperty(exports, "DateType", { enumerable: true, get: function () { return DateType_1.DateType; } });
const TimeType_1 = require("./TimeType");
Object.defineProperty(exports, "TimeType", { enumerable: true, get: function () { return TimeType_1.TimeType; } });
const DateTimeType_1 = require("./DateTimeType");
Object.defineProperty(exports, "DateTimeType", { enumerable: true, get: function () { return DateTimeType_1.DateTimeType; } });
const BigIntType_1 = require("./BigIntType");
Object.defineProperty(exports, "BigIntType", { enumerable: true, get: function () { return BigIntType_1.BigIntType; } });
const BlobType_1 = require("./BlobType");
Object.defineProperty(exports, "BlobType", { enumerable: true, get: function () { return BlobType_1.BlobType; } });
const ArrayType_1 = require("./ArrayType");
Object.defineProperty(exports, "ArrayType", { enumerable: true, get: function () { return ArrayType_1.ArrayType; } });
const EnumArrayType_1 = require("./EnumArrayType");
Object.defineProperty(exports, "EnumArrayType", { enumerable: true, get: function () { return EnumArrayType_1.EnumArrayType; } });
const EnumType_1 = require("./EnumType");
Object.defineProperty(exports, "EnumType", { enumerable: true, get: function () { return EnumType_1.EnumType; } });
const JsonType_1 = require("./JsonType");
Object.defineProperty(exports, "JsonType", { enumerable: true, get: function () { return JsonType_1.JsonType; } });
const IntegerType_1 = require("./IntegerType");
Object.defineProperty(exports, "IntegerType", { enumerable: true, get: function () { return IntegerType_1.IntegerType; } });
const SmallIntType_1 = require("./SmallIntType");
Object.defineProperty(exports, "SmallIntType", { enumerable: true, get: function () { return SmallIntType_1.SmallIntType; } });
const TinyIntType_1 = require("./TinyIntType");
Object.defineProperty(exports, "TinyIntType", { enumerable: true, get: function () { return TinyIntType_1.TinyIntType; } });
const FloatType_1 = require("./FloatType");
Object.defineProperty(exports, "FloatType", { enumerable: true, get: function () { return FloatType_1.FloatType; } });
const DoubleType_1 = require("./DoubleType");
Object.defineProperty(exports, "DoubleType", { enumerable: true, get: function () { return DoubleType_1.DoubleType; } });
const BooleanType_1 = require("./BooleanType");
Object.defineProperty(exports, "BooleanType", { enumerable: true, get: function () { return BooleanType_1.BooleanType; } });
const DecimalType_1 = require("./DecimalType");
Object.defineProperty(exports, "DecimalType", { enumerable: true, get: function () { return DecimalType_1.DecimalType; } });
const StringType_1 = require("./StringType");
Object.defineProperty(exports, "StringType", { enumerable: true, get: function () { return StringType_1.StringType; } });
const UuidType_1 = require("./UuidType");
Object.defineProperty(exports, "UuidType", { enumerable: true, get: function () { return UuidType_1.UuidType; } });
const TextType_1 = require("./TextType");
Object.defineProperty(exports, "TextType", { enumerable: true, get: function () { return TextType_1.TextType; } });
const UnknownType_1 = require("./UnknownType");
Object.defineProperty(exports, "UnknownType", { enumerable: true, get: function () { return UnknownType_1.UnknownType; } });
exports.t = {
    date: DateType_1.DateType,
    time: TimeType_1.TimeType,
    datetime: DateTimeType_1.DateTimeType,
    bigint: BigIntType_1.BigIntType,
    blob: BlobType_1.BlobType,
    array: ArrayType_1.ArrayType,
    enumArray: EnumArrayType_1.EnumArrayType,
    enum: EnumType_1.EnumType,
    json: JsonType_1.JsonType,
    integer: IntegerType_1.IntegerType,
    smallint: SmallIntType_1.SmallIntType,
    tinyint: TinyIntType_1.TinyIntType,
    float: FloatType_1.FloatType,
    double: DoubleType_1.DoubleType,
    boolean: BooleanType_1.BooleanType,
    decimal: DecimalType_1.DecimalType,
    string: StringType_1.StringType,
    uuid: UuidType_1.UuidType,
    text: TextType_1.TextType,
};
