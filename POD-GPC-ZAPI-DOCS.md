---
title: Combined Documentation
description: Combined documentation for POD, GPC, and z-api
---


## POD Documentation

### Disclaimers


## Stability

POD and GPC libraries are in beta and subject to change. We encourage devs to try them out and use them for apps, but be aware that updates will come in future.

The PODs themselves are persistent data, and we expect to maintain backward-compatibility when we make changes to the format. Library interfaces may also change. Any breaking changes will be reflected in the NPM versions using standard semantic versioning.

### Introduction


Provable Object Datatype (**POD**) is a standard for cryptographic data.

POD enables internet users to store data that preserve its integrity. This leads to a more interoperable and privacy preserving Internet: users can save their data and send it to other consumers, which can then verify that the data has not been modified. Cryptographic operations can be efficiently computed to redact, transform, and aggregate the content of one or more PODs while maintaining end-to-end verifiability.

POD libraries enable any app to create zero-knowledge proofs of cryptographic data. Using POD, developers can create ZK-enabled apps without the effort and risk of developing custom cryptography. ZK proofs about PODs use General Purpose Circuits (**GPC**) which can prove many different things about PODs without revealing all details. GPCs use human-readable configuration and pre-compiled circuits so no knowledge of circuit programming is required.

What [Zupass](https://zupass.org) has enabled with event tickets, PODs enable for all sorts of user data in all sorts of apps.  A POD could be your proof of attending an event, a secure message, a collectible badge, or an item in a role-playing game. PODs and GPCs can be used in Zupass, or in your own apps without Zupass.

POD is built and supported by [0xPARC](https://0xparc.org), and used by projects like [Zupass](https://zupass.org), [Frogcrypto](https://frogcrypto.xyz), [PODBox](https://podbox.dev), [Meerkat](https://meerkat.events/), [Devcon Passport](https://app.devcon.org/), and more.

## What is a POD?

To a user, a POD is a piece of cryptographic data attested by some issuing authority. For a developer, a POD object is a key-value store which can hold any data. The whole POD is signed by an issuer. Apps can verify the signature, to trust the authenticity of the values in the POD.

When a POD is issued, its entries (key-value pairs) are hashed as part of a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree).  This allows GPCs to selectively prove about individual entries without revealing the whole POD.

```ts
const podSword = POD.sign(
  {
    pod_type: { type: "string", value: "myrpg.item.weapon" },
    attack: { type: "int", value: 7n },
    reach: { type: "int", value: 5n },
    weaponType: { type: "string", value: "sword" },
    itemSet: { type: "string", value: "celestial" },
    isMagical: { type: "boolean", value: true },
    owner: { type: "eddsa_pubkey", value: purchaser.pubKey }
  } satisfies PODEntries,
  privateKey
);
```

Zero-knowledge proofs about PODs can be made efficiently and flexibly with [GPCs](/gpc/introduction).

## PODs in Zupass

PODs are the basis of new Zupass-enabled apps using the [ZApp SDK](/z-api/introduction).  PODs and GPCs are integrated into Zupass via PCD packages.  Newly-issued Zupass tickets use `PODTicketPCD`, while `PODPCD` can represent any other data such as collectible frogs.  `GPCPCD` enables the creation of arbitrary proofs.

## What's next?

- Dive in to write code on the [Getting Started](./getting-started) page.
- Read about how [GPCs](/gpc/introduction) make ZK proofs about PODs easy, or about how the [Z-API](/z-api/introduction) lets you access PODs and request proofs from Zupass.
- Read or watch more about PODs in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [intro and deep dive talks](/learning#pod-and-gpc) for more about how PODs and GPCs work.
- Read more about specific POD development topics using the links on the sidebar.

### Getting Started


import { PackageManagers } from "starlight-package-managers";
import { Aside } from '@astrojs/starlight/components';

The `@pcd/pod` package allows you to sign, verify, and manipulate data in the POD format.  This guide will walk you through how to get started with POD development. The examples below assuming you're using TypeScript, but the same steps will work from JavaScript as well.

You can find full information about the types and functions used here in the [API Reference](https://docs.pcd.team/modules/_pcd_pod.html).  If you prefer to read complete working code, check out the [tutorial example](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts).

## Installation

To get started with PODs, you will need to install the `@pcd/pod` package, using your preferred package manager:

<PackageManagers
  frame="none"
  pkgManagers={["npm", "yarn", "pnpm", "bun"]}
  pkg="@pcd/pod"
/>

The package is available in CJS or ESM format, and will work either in browser or in a server. The example code makes use of bigint literals, so requries a target of at least ES2020.

Packaging for a browser requires polyfill for some Node modules, including `buffer`, so watch for that if you see any dependency issues.

## Imports

Next, import the types and functions you need from the package.  See the [API Reference](https://docs.pcd.team/modules/_pcd_pod.html) for everything which is available, and import what you need as you write your code.  Here's an example covering the first few samples below:

```ts wrap=true title="pod.ts"
import { POD, PODEntries } from "@pcd/pod";
```

## POD Entries

A POD is made up of entries (the [PODEntries](https://docs.pcd.team/types/_pcd_pod.PODEntries.html) type), each containing a name ([PODName](https://docs.pcd.team/types/_pcd_pod.PODName.html)) and a value ([PODValue](https://docs.pcd.team/types/_pcd_pod.PODValue.html)).You can read more details and recommendations about POD [names](names) and [values](values) later in this guide.


In TypeScript code, all values have an explicit type specifier. Let's declare some sample entries, modeling a digital driver's license.  

```ts wrap=true title="pod.ts"
const myEntries: PODEntries = {
  name: {
    type: "string",
    value: "Filip Frog"
  },
  date_of_birth: {
    type: "date",
    value: new Date("1999-03-20T00:00:00.000Z")
  },
  postcode: {
    type: "int",
    value: 94107n
  },
  driver: {
    type: "boolean",
    value: true
  },
  cardholder: {
    type: "eddsa_pubkey",
    value: "ZnU07tyAUiWW2mmY3/z4aa3WxrctfSc0ch23752z6xM"
  },
  pod_type: { type: "string", value: "dmv.license" },
};
```

<Aside type="note" title="Semaphore Identities">
Semaphore identities are how GPCs determine ownership of PODs. In a real app the `cardholder` value above be the owner's public key, which is part of their Semaphore identity. You might obtain from Zupass using the [Z API](/z-api/introduction), or create a new identity using the [Semaphore libary](https://www.npmjs.com/package/@semaphore-protocol/identity).
</Aside>

## Sign a POD

A POD is always signed by some issuer. To sign a new POD you need a private key, which can be any 32 bytes, as a string in either hexadecimal or Base64.  These should be randomly generated in a secure way.

<Aside type="note" title="Signing Keys">
PODs can be signed by issuers, or by individual users. If your app issues PODs, you should store your signing key in your app server, and sign PODs server-side to avoid revealing your private key to users.  Users can also sign PODs with their own keys, which could be stored client-side. A user's Zupass identity includes private key which can be used to sign PODs using the [Z API](/z-api/introduction).
</Aside>

```ts wrap=true title="pod.ts"
  const signingKey = "AAECAwQFBgcICQABAgMEBQYHCAkAAQIDBAUGBwgJAAE";
  const myPOD = POD.sign(myEntries, signingKey);
  const sig = myPOD.signature;
  const pubKey = myPOD.signerPublicKey;
  const cid = myPOD.contentID;
```

You can access the `signature` and `signerPublicKey` fields to see the results.

Once a POD is Merklized and signed, it is immutable.  The root of the Merkle tree is available in the `contentID` field which uniquely identifies the (unsigned) contents of this POD. The content ID is like a hash (actually the root of a Merkle tree) in that the same entries will always result in the same content ID.


## Verify a Signature

If you receive a POD from an untrusted source, it's always a good idea to verify the signature. An invalid signature will make it impossible
to generate ZK proofs of the POD.

```ts wrap=true title="pod.ts"
  if (!myPOD.verifySignature()) {
    throw new Error("Bad POD!");
  }
```

## POD Contents

Inside a POD is a PODContent object which acts as a Map-like object for accessing the POD's entries. The PODContent class also forms the Merkle tree in which the entries are cryptographically arranged to calculate the content ID.

Merklization happens lazily on-demand, with the result cached to avoid duplicated effort. The PODContent class can also generate Merkle membership proofs for individual entries, which are needed for GPC
proving.

```ts wrap=true title="pod.ts"
  const postcode = myPOD.content.getValue("postcode");
  const driverProof = myPOD.content.generateEntryProof("driver");
```

## JSON Serialization

PODs, and related types like entries are not directly stringifiable due to the use of bigints, and class objects. There are supported
conversion functions for all types to/from JSON compatible types which can be used for serialization via `JSON.stringify`.

You can find TypeScript types with the `JSON` prefix added to the primary type: e.g. `POD` to `JSONPOD`, `PODValue` to `JSONPODValue`, etc. The conversion functions also validate that all the data is legal and well-formed.

```ts wrap=true title="pod.ts"
  const jsonPOD: JSONPOD = myPOD.toJSON();
  const serializedPOD: string = JSON.stringify(jsonPOD);

  const jsonValue: JSONPODValue = podValueToJSON(
    myPOD.content.getValue("driver")!
  );
  const serializedValue: string = JSON.stringify(jsonValue);
```

The JSON format is optimized to be human-readable as well as short.  It omits type information in cases where the types can be properly derived from standard JSON types.

```json wrap=true title="myPOD.json"
{
  "entries": {
    "cardholder": {
      "eddsa_pubkey": "eNrg5aYuoHKsJulwbG4nxI9pExcU3lEDjdaRP5APgwA"
    },
    "date_of_birth": {
      "date": "1999-03-20T00:00:00.000Z"
    },
    "driver": true,
    "name": "Filip Frog",
    "pod_type": "dmv.license",
    "postcode": 94107
  },
  "signature": "FjsZefQkMbMeltBv83SWGAbdphBrZqtmNukkwERQeAG71Boc+E9iOZO6tMQFBNwkNWGpY1J30GLOPzvyXytPAA",
  "signerPublicKey": "xDP3ppa3qjpSJO+zmTuvDM2eku7O4MKaP2yCCKnoHZ4"
}
```

Deserialization can be performed by performing the reverse conversion after calling `JSON.parse`. This conversion also fully validates the input and will throw if the data is malformed.

```ts wrap=true title="pod.ts"
  const receivedPOD: POD = POD.fromJSON(JSON.parse(serializedPOD));
  const receivedValue: PODValue = podValueFromJSON(
    JSON.parse(serializedValue)
  );
```

## What's next?

- Check out the rest of the pages of this guide for deeper dives on various aspects of PODs.
- Check the [Developer Resources](resources) for references to related packages.
- Read about how [GPCs](/gpc/introduction) make ZK proofs about PODs easy, or about how the [Z-API](/z-api/introduction) lets you access PODs and request proofs from Zupass.
- Read or watch more about PODs in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [intro and deep dive talks](/learning#pod-and-gpc) for more about how PODs and GPCs work.

### Names


import { Aside } from '@astrojs/starlight/components';

A POD is a cryptographic record with no enforced schema. A POD is made up of entries consisting of a [name](#legal-names) (always a string) and a [value](./values) (of a supported type). Values are scalars with no nested objects, meaning the POD structure is flat.

Apps can represent their data however they like. Entry names and values are hashed and cryptographically verified in a POD. The issuer of a POD decides what the expected set of names and values should be for their use case. The definition order of entries is not important since entries area always sorted by name before hashing.

- **Names**: The cryptography behind PODs will accept any name or value which can be validly hashed. The POD library enforces the [legal characters in names](#legal-names) described below.
- **Value schemas**: There is no formal notion of a schema for POD entries, but there are some recommended best-practices apps should follow, most particularly the use of the [`pod_type`](#pod_type) and [Zupass Display](#zupass-display) entries described below.

The rest of this page describes the requirements and recommendations about POD names and schemas.

## Legal Names

POD names (represented by the [`PODName`](https://docs.pcd.team/types/_pcd_pod.PODName.html) type) are limited to a character set which matches variable identifiers in most languages. They allow alphanumeric characters and underscores, and cannot begin with a digit. This allows `PODEntries` to be conveniently accessed as TypeScript objects without quoting their names:

```ts
const idEntries = idPOD.asEntries();
if (idEntries.pod_type === "zu_gov.id") {
  const user = findUser(idEntries.idNumber);
  // ...
}
```

<Aside type="caution" title="Security and Future Proofing">
While the legal characters are checked by the SDK, they are not cryptographically enforced. Custom code can sign a POD with any string in its names. Thus if your app will be consuming data in unknown formats, you shouldn't assume that a POD name won't contain special characters beyond those defined here. E.g. if a POD name comes from untrusted input, you shouldn't assume it won't contain special characters used for SQL injection.
</Aside>

This limited character set is restrictive today, but may expand in future versions to support new features. This also leaves special characters to be used for special purposes outside of PODs themselves, such as in GPC proof configuration (see below).

### Use of Names in GPCs

The `PODName` specification is also used in GPC configuration when a name is needed to refer to a whole POD, or a list of values, etc. These names follow the same `PODName` rules for convenience, but this detail is not cryptographically relevant. These names exist only for the GPC compiler to correlate different parts of the config and inputs, and do not appear in the ZK circuit.

<Aside type="note" title="Name Order">
The GPC compiler uses lexicographic order to sort multiple PODs or entries before asigning the modules in a circuit. Thus while the extended names in config are arbitrary and could be changed, it is important that prover and verifier at least agree on their order.
</Aside>

The GPC compiler also uses some special characters when naming things in constraints, for example:

- `idPOD.idNumber` names a POD and an entry of that POD. In this case `idPOD` is an arbitrary name assigned to a POD, while `idNumber` is the name of an entry which must be in the POD.
- `idPOD.$signerPublicKey` names the public key of a POD. The name `$signerPublicKey` never appears in the POD itself, but the config compiler treats it as a virtual entry when defining constraints.

## Reserved Names

Apps should avoid defining their own entry names with the prefixes `pod_` or `zupass_` as these are reserved for special uses in the SDK, or in Zupass. Some of these have defined uses described below, which apps are encouraged to use accordingly. Remaining names with those prefixes are reserved for future use.

### `pod_type`

The `pod_type` entry is the a recommended way for apps to tag their PODs to let their contents be understood across apps. It should be used by apps to identify the purpose or schema of their PODs using some unique identifier. In future, this might be used to index into a library of published schema identifiers.  For now, the `pod_type` is not enforced, but is helpful to avoid mixing PODs with common names. For instance, `pod.name` means something different on a driver's license than it does on a collectible frog.

There is no required format for `pod_type`, but it is recommended to contain the name or identifier of your app so as to be unique. [Reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) is a good way to ensure that.

<Aside type="caution" title="pod_type Security">
The `pod_type` is a good way to avoid accidental misuse, but is usually only the second step in trusting the meaning of a POD. The first step should always be to check that the POD is signed, and almost always to check that its public key is a trusted signer. A known signer might be trusted to follow a schema, making `pod_type` redundant (but still recommended) for signers which issue only one type of POD. An untrusted signer could sign anything, so if your app accepts data from any signer (e.g. user-signed PODs) be sure to check its validity like any untrusted input.
</Aside>

### Zupass Display

Zupass is a generic POD store able to hold any type of POD, and show the user its entries. It's easier for a user if that POD can display in a friendlier format than a JSON dump. If you anticipate your POD being stored in Zupass, you should set one or more of the following fields:

- `zupass_display` (string): the preferred display format for your POD.  Accepted values are:
  - `collectable` displays the other fields described below in a card.  Requires at least one of title, description, or image URL to be set.
  - `pod` explicitly chooses the default JSON display
- `zupass_title` (string): a short title for your POD, used in folder listings and/or the top of the display card.
- `zupass_description` (string): a text description of your POD
- `zupass_image_url` (string): the URL to fetch an embedded image to display with your POD.

<Aside type="note" title="Images">
Any URL suitable for an `<image>` tag should work in `zupass_image_url`.  Be careful to select an image URL which will remain available, to avoid broken image links when users save their PODs into the future.  You can also use a `data:` URL for embedded images, though this is suitable only for small icons.  Zupass enforces a maximum size for PODs, currently at 10KB.
</Aside>

Outside of Zupass, how you display your PODs is entirely up to you. You can use the JSON format defined by `pod.toJSON()` which is intended to be human-readable, but you can also invent your own formats more specific to your app.

## Suggested Best Practices

Here are some remaining suggestions about naming and using POD entries, which don't depend on reserved characters or names.

### Ownership

PODs can be marked with a user's identity in a way which allows a GPC to [prove ownership](/gpc/identity-ownership). There is no fixed entry name for this purpose, since it can be selected in the GPC configuration. Thus you could name your ownership entry `attendee` or `citizen` as befits your use case. However if you want a recommended default, you can use an entry named `owner` of type `eddsa_pubkey`.

### Example POD

Here is an example POD which follows all the requirements and best-practices described in this page.  This is the [Meerkat](https://meerkat.events/) app's proof of attendance from a talk at Devcon 7 SEA.

```json
{
  "entries": {
    "code": "MQ8T8Z",
    "conference": "Devcon SEA",
    "end_date": {
      "date": "2024-11-12T08:30:00.000Z"
    },
    "owner": {
      "eddsa_pubkey": "DVZ1idpAigmvfwYem2pvbHNPp7IAia0ER98dwxVrd5M"
    },
    "pod_type": "events.meerkat/attendance",
    "start_date": {
      "date": "2024-11-12T08:00:00.000Z"
    },
    "track": "Applied Cryptography",
    "version": "1.0.0",
    "zupass_description": "Programmable Cryptography is a \"second generation\" of cryptographic primitives - primitives that allow arbitrary programs to be executed \"inside of\" or \"on top of\" cryptographic objects. Programmable cryptography provides three key affordances that complement and amplify the affordances of Ethereum--verifiability, confidentiality, and non-interactivity. We'll discuss how these technologies can reshape the Internet over the next 50 years.",
    "zupass_display": "collectable",
    "zupass_image_url": "https://icnyvghgspgzemdudsrd.supabase.co/storage/v1/object/public/images/owl_Applied%20Cryptography.png?t=2024-10-31T11%3A20%3A31.354Z",
    "zupass_title": "Keynote: Programmable Cryptography and Ethereum"
  },
  "signature": "k7NpiGbrSZJRivZ5D4RXQTFs2w+EsFjeYiFuxUloY56AryxzeQdAh6yUtABhw1r8EElx9no59gKrD+htlRqFAQ",
  "signerPublicKey": "XfAQCwo2k69LAW1gRLUs1qsnQ2rVJ6VaF3yotol5HQ4"
}
```

### Values


import { Aside } from '@astrojs/starlight/components';

## POD Content

A POD is a cryptographic record made up of entries consisting of a [**name**](./names) (always a string) and a value of a supported type. Values are scalars with no nested objects, meaning the POD structure is flat.

The full contents of a POD are uniquely identified by a **content ID**. The content ID can be thought of as a hash of the content generated in a way which is deterministic and optimized for easy ZK proving (see the [PODContent](https://docs.pcd.team/classes/_pcd_pod.PODContent.html) class for more). The content ID is signed using the issuer's private key to generate the POD's **signature** (in the [POD](https://docs.pcd.team/classes/_pcd_pod.POD.html) class).

Cryptographically each entry's name and value is identfied by a hash: a [cryptographic number](#cryptographic-numbers) which uniquely and securely identifes that specific value. **Name hashes** and **value hashes** are calculated separately for each entry, then hashed together in a [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree). The root of the tree is the aforementioned content ID.

**Value types** are hints used by the library to determine how value in TypeScript is reduced to a hash This also determines how a value can be used in GPC proofs. The type itself is not part of the cryptographic identity of an entry. This means if two values have the same value hash, they are considered the same value, even if they were declared with different types. For instance `{int: 1}` and `{boolean: true}` are the same value.

<Aside type="caution" title="Type Security">
See the note on [type security](#type-security) below for security implications of this.
</Aside>

## Value Types

Below we summarize the details of all supported value types, and how they can be used. Follow the links in column headers for more information about what they mean, or see [below](#supported-types) for info specific to each suported type.

| [POD Type](#supported-types) | [TypeScript Type](#supported-types) | [Hash](#hash-functions) | [Values](#supported-types) | [Equivalency](#equivalency-categories) | [Ordered](#ordered-types) | 
| --- | --- | --- | --- | --- | --- |
| cryptographic | bigint | Poseidon1 | field element | number | no |
| int | bigint | Poseidon1 | 64-bit signed | number | yes |
| date | Date | Poseidon1 | millis since epoch | number | yes |
| boolean | boolean | Poseidon1 | true/false | number | yes |
| string | string | SHA | UTF-8 | string | no |
| bytes | Uint8Array | SHA | any bytes | string | no |
| eddsa_pubkey | string | Poseidon2 | elliptic curve point | - | no |
| null | null | constant | null | - | no |

### Supported Types

The POD libraries in TypeScript declare types which best fit the POD value types, and perform input validation to ensure the values are in legal ranges. See the note on the note on [type security](#type-security) to be sure you're not trusting it too much.

- **cryptographic** is a numeric type typically used to hold hashes or signatures. It is an unsigned number in a range [0, p-1] for a large prime p (254 bits). It is represented directly as a [**field element**](#cryptographic-numbers) supported by the elliptic curve cryptography which underlies PODs.
- **int** is a numeric type limited to a range suitable for efficient arithmetic and comparisons in GPC circuits. ints are 64-bit signed values, in the range [-2<sup>63</sup>, 2<sup>63</sup>-1], the same range as the 2s-complement representation in most CPU platforms. 
- **boolean** is a convenience type equivalent to an int with values 0 (false) and 1 (true).
- **date** is a convenience type equivalent to an int holding milliseconds relative to the UNIX epoch. It is signed, so it can represent dates earlier than 1970. Its range is limited to that of the JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date) type (which is approximately &pm;53 bits).
- **string** can represent any Unicode string, which is internally encoded in UTF-8.  Strings can be compared only for equality in GPCs.
- **bytes** can hold any array of bytes, and behave similarly to strings in GPCs.
- **eddsa_pubkey** is a specialized type for user or signer identities using the EdDSA algorithm. In TypeScript it is represented as a Base64 representation of the packed elliptic curve point. In GPC circuits, it can be compared to POD signers, and used to prove ownership.
- **null** is a type with a single unique value which will not compare equal to any other value. An entry with a value of null is **not** the same as an absent entry. GPC proofs cannot prove the absence of an entry, so if the issuer sets an entry to null it can help clients to prove that no other value is present.

### Equivalency Categories

The categories in the table above indicate which types can compare as equal to each other. When two POD values are compared for equality in a proof (such as with an `equalsEntry` constraint), it is their value hashes which are compared. The [hash functions](#hash-functions) described below thus determine equivalency. This can be helpful in defining proof constraints, but see [type security](#type-security) below for some cautions on how to avoid unsafe assumptions.

All numeric types are equivalent if they have the same numeric value, since they are all represented as field elements. `{cryptographic: 0}`, `{int: 0}`, `{boolean: false}`, and `{date: "1970"}` are all equivalent. If your app needs to treat different types differently, you should be it is checking the appropriate requirements for your use case.

Strings are quivalent to a byte array containing their UTF-8 encoding. The remaining types are not equivalent to any other types.

### Ordered Types

Arithmetic in ZK circuits is limited by the circular nature of modular arithmetic. To efficiently perform more traditional arithmetic and comparisons while avoiding overflows, POD values must be limited to a smaller range.

In the current GPC libraries, only numeric values which fit within 64 bits can be subjected to ordering constraints such as `inRange` or `lessThan`. In future these are also the types which might be added or multiplied together in more customized constraints.

Strings and bytes are not considered "ordered" for this purpose since they have no numeric ordering. Custom constraints on variable-length values such as strings are not currently supported in GPCs.

## Implementation Details

### Cryptographic Numbers

What makes PODs ZK-friendly for proving is their choice of numeric representation, as well as algorithms for hashing and signing. These are tied to the specific proving systems used by [Circom](https://docs.circom.io/). These are tied to elliptic curve cryptography using modular arithmetic on the [Baby Jubjub prime field](https://iden3-docs.readthedocs.io/en/latest/iden3_repos/research/publications/zkproof-standards-workshop-2/baby-jubjub/baby-jubjub.html). Elements of this prime field are integers from 0 to p-1 where p is a 254-bit prime. Computers typically hold these in 256 bit values.

The details of this are mostly hidden from users of the POD library, but are visible in raw **cryptographic** values representing hashes, signatures, and a POD's content ID. Programmers can generally treat these as opaque values, so long as they can handle the `bigint` type. All other numeric types are also represented internally as field elements, but the libraries handle the details of the translation.

### Hash Functions

All values are identified by their hash using one of these hash functions.

- **Poseidon**: Fixed-size values use a Poseidon hash, which is ZK-friendly and can be directly validated in a GPC circuit. In GPC proofs, these are the values which can be subjected to customized constraints on their value beyond simple equality. The Poseidon hash varies by number of inputs. Most numeric values use the single-input variant [`podIntHash`](https://docs.pcd.team/functions/_pcd_pod.podIntHash.html) function, while EdDSA public keys use the 2-input variant [`podEddsaPublicKeyHash`](https://docs.pcd.team/functions/_pcd_pod.podEdDSAPublicKeyHash.html) to cover the x and y coordinate of an elliptic curve point.

- **SHA**: Variable-size values (strings and bytes) use a SHA256 hash, truncated (via right-shift) to 248 bits in order to fit in a field element (see the [`podStringHash`](https://docs.pcd.team/functions/_pcd_pod.podStringHash.html) function). The names of POD entries also use the same hash function. This hash is not efficient to perform in a ZK circuit, so comparisons in proofs are always by hash. The GPC Verifier re-hashes strings to ensure their hashes match what is in the circuit.

- **constant**: The null value has a single fixed constant as its defined hash value, with no algorithm needed.

### Type Security

The non-cryptographic nature of value types has some security implications. The POD libraries will helpfully ensure values are in range for their types, but a buggy or malicious implementation could violate those rules. The nature of the hashes used means that values will only ever have the same hash if their original types are in the same of [equivalency category](#equivalency-categories). (For a strong hash function, the probability of collision is negligible within the cryptographic assumptions of the algorithms used.)

Treating an input differently based on its type using a type switch pattern isn't reliable when operating on POD values. Avoid designing schemas which rely on mixing heterogeneous types in an entry of the same name.

When checking security assumptions with PODs or GPC proofs, always make sure you're constraining an entry's value not just relying on its type. This is particularly important in proof constraints where the original value and type are not revealed.  For instance, don't assume that a `boolean` can't be equal to 100, or that an `int` can't be more than 2<sup>63</sup>. Check the value before using it for security decisions, or to index arrays which could overflow. In GPC proofs, you can use the `inRange` constraint to ensure a value lies in an expected range.

### Resources


import { Aside } from '@astrojs/starlight/components';

The POD and GPC libraries are available for JavaScript/TypeScript developers.  Start by looking at the [tutorial code here](https://github.com/proofcarryingdata/zupass/tree/main/examples/pod-gpc-example), then you can take a look at the specific packages listed below.

All code is open-source and available in the Zupass [repo](https://github.com/proofcarryingdata/zupass).  Detailed documentation is at [docs.pcd.team](https://docs.pcd.team/).  We hope you'll give them a try and [tell us](mailto:support@zupass.org) what you think.

## POD Packages

### @pcd/pod

Links: [NPM](https://www.npmjs.com/package/@pcd/pod), [tutorial](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts), [docs](https://docs.pcd.team/modules/_pcd_pod.html), [code](https://github.com/proofcarryingdata/zupass/tree/main/packages/lib/pod)

Allows creation and signing of PODs, and manipulation of their keys and values.

### @pcd/pod-pcd

Links: [NPM](https://www.npmjs.com/package/@pcd/pod-pcd), [tutorial](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/podExample.ts#L214), [docs](https://docs.pcd.team/modules/_pcd_pod_pcd.html), [code](https://github.com/proofcarryingdata/zupass/tree/main/packages/pcd/pod-pcd)

Allows PODs to be issued by Podbox, stored in Zupass, and requested and manipulated in all the ways enabled by the PCD framework.  A PODPCD can be displayed in Zupass with a user-friendly image and description, or as raw POD entries.

## Ports to other languages

While the only fully-supported SDK for PODs is currently in TypeScript, the POD technology is portable (defined by math).  Its implementation has been ported to other languages to support various projects during POD development.

<Aside type="caution" title="Compatibility Notes">
Note that these are not complete SDKs and not actively supported, but should be taken as cryptographically sound examples of cross-language compatibility.  All the examples here use the same cryptographic definition of PODs, and are compatible at that level.  Compatibility of JSON encoding is variable.

The Go implementation is the only one which is up to date on the latest JSON format for sending PODs.  The others use a pre-alpha incompatible format and will not accept newer PODs from the TypeScript library.  Zupass can parse this older format if it is encoded in a POD PCD, but the `@pcd/pod` library cannot.
</Aside>

### Go (PARCNET)

POD implementation in Go.  This implementation is up to date with the latest JSON format, and thus fully compatible with TypeScript.

- [Source code](https://github.com/0xPARC/parcnet/tree/main/go/pod)

### Rust (PARCNET)

POD implementation in Rust used in next-gen POD (POD2) development.

- [Source code](https://github.com/0xPARC/parcnet/tree/main/parcnet-pod/src/pod)

### Python (miniPOD)

Minimal Python code to sign a POD and send it to Zupass using a URL link.

- [Source code](https://github.com/antimatter15/minimal-eddsa-pod-pcd-python/blob/main/minimal-pod-pcd-zupass.ipynb)

### Embedded C (microPOD)

Based on the Python implementation above, this project signed and issued a POD from an embedded hardware device (Cyberduck).  This was a precursor to the Cyberfrogs seen at Devcon 7 SEA in 2024.  (Note that the final released Cyberfrogs do not sign PODs, but instea sign a nonce which the server verifies before issuing a POD.)

- [Source code](https://github.com/antimatter15/microPOD/blob/main/DuckV4/DuckV4.ino#L328)

## Related APIs

- Proofs about PODs can be made using [GPCs](/gpc/introduction)
- Interact with PODs in Zupass using the [Z API](/z-api/introduction)

### Examples


## Tutorials and Examples

See the [Getting Started](/pod/getting-started) page for an initial intro, but if you prefer reading a tutorial in the form of heavily commented code, you can find it [here](https://github.com/proofcarryingdata/zupass/tree/main/examples/pod-gpc-example).

### ZuKyc

An end-to-end developer demo showing how PODs & GPCs can be used to apply for a loan by proving a borrower's identity, age, and income.  You can build and run the demo locally, or using the pre-deployed servers.

- Detailed tutorial here: [README](https://github.com/proofcarryingdata/zukyc/blob/main/README.md)
- Check out the app here: [ZooLender](https://zukyc-gpc-verifier.vercel.app/), [code](https://github.com/proofcarryingdata/zukyc)

### POD issuer

A server which allows users to "mint" their own PODs (with cryptographic ownership) based on a URL which can be embedded in a QR code.  You can run your own issuing server and decide which PODs you'd like to issue.

- [Source code](https://github.com/proofcarryingdata/pod-issuer)

## Live Apps

These apps all use PODs in production.  More live apps coming soon.  They're launching at Devcon now...

### Frogcrypto

A game of collecting cryptographic frogs.  [Frogcrypto](https://frogcrypto.xyz) is re-launching at Devcon 7 SEA with new features to discover.  More details here after the conferene.

### Meerkat

Meerkat is a Q&A app for live audience engagement. With Meerkat, attendees of an event or conference can submit questions, upvote their favorites, share reactions, and collect session artifacts as PODs. At an event, each talk will display a QR code, making it easy to join the Q&A by verifying your access through your privacy-preserving Zupass access ticket.

- Check out the app here: [Meerkat](https://meerkat.events)
- [Source code](https://github.com/meerkat-events/meerkat)

### Frog Lab

Derive novel substances from your frogs.  The lab uses the Z-API to select frogs, and generate novel substances saved back to Zupass as PODs.

- Try it out at [shuljin.engineering](https://shulgin.engineering)
- [Source code](https://github.com/Moving-Castles/shulgin.engineering)


## GPC Documentation

### Disclaimers


## Stability

POD and GPC libraries are in beta and subject to change. We encourage devs to try them out and use them for apps, but be aware that updates will come in future.

GPC proofs are considered ephemeral (for now), primarily intended for transactional use cases. Saved proofs may not be verifiable with future versions of code.

## Security

These libraries should not be considered secure enough for highly-sensitive use cases yet. The cryptography, circuits, and configuration compiler have not been audited. The proving and verification keys were generated in good faith by a single author, but are not the result of a distributed trusted setup ceremony.

### Introduction


General Purpose Circuits (**GPC**) are a part of the POD standard for cryptographic data.  GPC is system for easily and flexibly generating zero-knowledge proofs about [POD](/pod/introduction) data.

GPC libraries enable any app to create zero-knowledge proofs of cryptographic data. Using GPCs, developers can create ZK-enabled apps without the effort and risk of developing custom cryptography. General Purpose Circuits can prove many different things about PODs without revealing all details. GPCs use human-readable configuration and pre-compiled circuits so that no knowledge of circuit programming is required.

GPC is built and supported by [0xPARC](https://0xparc.org), and used by projects like [Zupass](https://zupass.org), [PODBox](https://podbox.dev), [Meerkat](https://meerkat.events/), [Devcon Passport](https://app.devcon.org/), and more.

## What is a GPC?

GPCs allow ZK proofs to be created from a simple proof [configuration](/gpc/proof-configuration).  You can configure your proofs using a human-readable JSON format (or equivalent TypeScript code), which is used to generate the specific circuit inputs needed for the proof.

```ts
const weaponProofConfig: GPCProofConfig = {
  pods: {
    weapon: {
      entries: {
        attack: { isRevealed: true },
        reach: { isRevealed: false,
                 inRange: { min: 5n, max 10n } },
        weaponType: { isRevealed: false,
                      isMemberOf: "proficientWeapons" },
        owner: { isRevealed: false, isOwnerID: "SemaphoreV4" }
      }
    }
  }
};
```

GPCs can prove properties of one POD or several PODs together.  PODs can be proven to be [owned](/gpc/identity-ownership) by the prover, using their Semaphore identity.  A GPC can constrain as many named entries as needed, whether revealed or not.  For example, a proof might constrain two entries to be equal, constrain a third entry to be in a list of valid values, and reveal the value of a fourth entry.

## Circuit family

The GPC library inclues a family of pre-compiled ZK circuits with different sizes and capabilities.  It will automatically select the right circuit to satisfy the needs of each proof at run-time.  No setup is required, and you don't need any knowledge of circuit programming (circom, halo2, noir, etc).

Using circuits in this family to prove and verify requires downloading binary [artifacts](/gpc/artifacts): proving keys, verification keys, and witness generators.  The GPC library will automatically fetch the artifacts it needs from a download URL or local filesystem, based on your app's configuration.

## GPCs in Zupass

GPCs are the basis of proofs in new Zupass-enabled apps using the [ZApp SDK](/z-api/introduction).  PODs and GPCs are integrated into Zupass via PCD packages.  Newly-issued Zupass tickets use `PODTicketPCD`, while `PODPCD` can represent any other data such as collectible frogs.  `GPCPCD` enables the creation of arbitrary proofs.

## What's next?

- Dive in to write code on the [Getting Started](./getting-started) page.
- Read about [PODs](/pod/introduction) and how the [Z-API](/gpc/introduction) lets you request proofs about PODs from Zupass.
- Read or watch more about PODs in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [intro and deep dive talks](/learning#pod-and-gpc) for more about how PODs and GPCs work.
- Read more about specific GPC development topics using the links on the sidebar.

### Getting Started


import { PackageManagers } from "starlight-package-managers";
import { Aside } from '@astrojs/starlight/components';

The `@pcd/gpc` package allows you to prove and verify using GPCs.  This guide will walk you through how to get started with POD development. The examples below assuming you're using TypeScript, but the same steps will work from JavaScript as well.

You can find full information about the types and functions used here in the [API Reference](https://docs.pcd.team/modules/_pcd_gpc.html).  If you prefer to read complete working code, check out the [tutorial example](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/gpcExample.ts).

## Installation

To get started with GPCs, you will need to install the `@pcd/pod` package, using your preferred package manager:

<PackageManagers
  frame="none"
  pkgManagers={["npm", "yarn", "pnpm", "bun"]}
  pkg="@pcd/gpc"
/>

The package is available in CJS or ESM format, and will work either in browser or in a server. The example code makes use of bigint literals, so requries a target of at least ES2020.

Packaging for a browser requires polyfill for some Node modules, including `buffer` and `constants`, so watch for that if you see any dependency issues.

There is a known issue with a dependency `fastfile` which can be resolved by polyfilling `constants` as you can see in [this example](https://github.com/proofcarryingdata/zukyc/pull/3).

## Imports

Next, import the types and functions you need from the package.  See the [API Reference](https://docs.pcd.team/modules/_pcd_gpc.html) for everything which is available, and import what you need as you write your code.  Here's an example covering the first few samples below:

```ts wrap=true title="gpc.ts"
import { 
  gpcArtifactDownloadURL,
  GPCProofConfig, gpcProve,
  gpcVerify
} from "@pcd/gpc";
```

## Prove or verify?

The GPC library allows you to create and verify zero knowledge proofs about PODs.  Depending on your use case, your app may need to prove, or verify, or both.  You may need to so either client-side (in browser) or server-side.

If you intend to integrate with Zupass, you can use the [Z-API](/z-api/introduction) to query the user's PODs, and request proofs about them without using the GPC library directly.  In that case, you can skip ahead to the verification section of this guide.

This remainder of this guide walks through the steps to both prove and verify in your own app in a browser.

## Preparing Inputs

### PODs

In order to make a proof, you first need some PODs.  The examples below will work with the example POD signed in [POD Tutorial](/pod/getting-started).  Check out that page first to learn how to work with PODs.

### Artifacts

Proving and verifying also requires binary files called artifacts, which are tailored to a specific GPC circuit.  The prover and verifier need to use the same artifacts for proofs to be valid.  Artifacts released separately from the code since they're large enough not to be packaged with your app bundle.  You can obtain artifacts from NPM or direct download.

See the [Circuit Artifacts](/gpc/artifacts) page for full details about how to manage artifacts.  For this example, we'll fetch them from a CDN backed by NPM.

```ts wrap=true title="gpc.ts"
  const artifactURL = gpcArtifactDownloadURL(
    "jsdelivr",
    "prod",
    undefined
  )
```

## Proof Configuration

To make a proof, you first have to say what you want to prove.  A `GPCProofConfiguration` specifies the POD entries you want to prove, and the constraints you want to apply to them.  The [Proof Configuration](/gpc/proof-configuration) page has full details, but let's start with a simple configuration.  This will prove that the ID POD has a birthdate earlier than Nov 11 2003 (represented as a UNIX timestamp), and reveal the holder's name.

```ts wrap=true title="gpc.ts"
const proofConfig: GPCProofConfig = {
  pods: {
    idcard: {
      entries: {
        name: { isRevealed: true },
        date_of_birth: {
          isRevealed: false,
          inRange: { min: 0n, max: 1068508800000n }
        }
      }
    }
  }
};
```

<Aside type="note" title="Ownership">
Note that this configuration proves that the POD is properly signed, but doesn't perform an ownership check to see that the prover has the private key corresponding to the public key in the `cardholder` entry.  To add that extra safety check, check out the [Identity and Ownership](/pod/identity-ownership) page.
</Aside>

## Make a proof

With all the preparation in place you can format the inputs to make your first ZK proof!  The `proofInputs` argument lets you match up real PODs with the names used in the configuration.

```ts wrap=true title="gpc.ts"
  const proofInputs = {
    pods: {
      idcard: myPOD
    }
  }
  const { proof, boundConfig, revealedClaims } = await gpcProve(
    proofConfig,
    proofInputs,
    artifactURL
  );
```

The result of proving includes 3 types of data:

- `proof` is the cryptographic proof of correctness.  These are opaque numbers which can be used to verify the correctness of the other fields here.
- `boundConfig` is the same as the configuration you passed in, except it now contains the identifier of the specific circuit which was auto-selected for the proof.
- `revealedClaims` contains the information revealed in this proof.  In this case, it includes the `name` entry, as well as the public key of the ID card's signer.

## Transmit the proof as JSON

Usually the prover and verifier won't be the same app (otherwise there would be no need for a proof).  The results of `gpcProve()` are precisely the values which need to be sent to the verifier.

You can send these objects across the network using JSON.  However, they contain non-JSON-compatible types such as `bigint` so they need to be converted before transmission.

```ts wrap=true title="gpc.ts"
  const proofMessage = JSON.stringify({
    proof: proof,
    boundConfig: boundConfigToJSON(boundConfig),
    revealedClaims: revealedClaimsToJSON(revealedClaims)
  });
```

The verifier can reverse the conversion to recover the original objects.  The conversion also fully validates the structure of the objects, and will throw an error if they are malformed.

```ts wrap=true title="gpc.ts"
  const receivedFromProver = JSON.parse(proofMessage);
  const proof = receivedFromProver.proof;
  const boundConfig = boundConfigFromJSON(receivedFromProver.boundConfig);
  const revealedClaims = revealedClaimsFromJSON(receivedFromProver.revealedClaims);
```

## Verify the proof

Finally the verifier can confirm that the proof is valid using `gpcVerify()`.  This needs all three parts of the proof result, as well as the same artifact download URL used by the prover.

```ts wrap=true title="gpc.ts"
  const isValid = gpcVerify(
    proof,
    boundConfig,
    revealedClaims,
    artifactURL
  );
```

## Check assumptions

If `gpcVerify()` returns true, you know you have a valid proof of **something**, but it's still important to confirm it's the right proof.  The logic inside `gpcVerify()` ensures that all the contents of the config and revealed claims properly correspond to each other, but it can't decide whether they match your app's expectations.

To avoid being fooled by cheating provers, should check:

- The signer's public key is the one you expect.  Trusted issuers, such as Zupass should publish their public keys.
- The configuration reflects what you wanted to prove.

Finally you should remember to examine the revealed entries.  In this case the user's name was revealed, so it could be checked against the guest list for an event.

{/* TODO: Move some of this detail into the verification page. */}
<Aside type="note" title="Checking Requested Configuration">
If the prover can use any configuration, it's can be hard to know if they're proving the right thing.  It could require examining each entry in the config one by one.  See the [Verification](/gpc/verification) page for a full discussion.

In many cases, though, it's the verifier who provides the configuration when they request a proof.  In this case there's an easy way for the verifier to be sure the proof matches the config they requested.  They can use their original config to call `gpcVerify()`.  All they need from the prover is the circuit identifier.  Code to do this check might do something like this:

```ts wrap=true title="gpc.ts"
  const verifyConfig: GPCBoundConfig = {
    ...requestedConfig,
    circuitIdentifier: boundConfig.circuitIdentifier
  }
  const isValid = gpcVerify(
    proof,
    verifyConfig,
    revealedClaims,
    artifactURL
  );
```
</Aside>

## What's next?

- Check out the rest of the pages of this guide for deeper dives on various aspects of GPCs.
- Read about [PODs](/pod/introduction) and how the [Z-API](/z-api/introduction) lets you request proofs about PODs from Zupass.
- Check the [Developer Resources](resources) for references to related packages.
- Read or watch more about PODs in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [intro and deep dive talks](/learning#pod-and-gpc) for more about how PODs and GPCs work.

### Identity Ownership


## Coming Soon

Please pardon our dust as we finish this site.  In the mean time, if you're at Devcon, you should check out our programming at Devcon for more information.  You can also ask questions in our Telegram group at [t.me/zupass](https://t.me/zupass).

### Proof Configuration


## Coming Soon

Please pardon our dust as we finish this site.  In the mean time, if you're at Devcon, you should check out our programming at Devcon for more information.  You can also ask questions in our Telegram group at [t.me/zupass](https://t.me/zupass).

### Verification


## Coming Soon

Please pardon our dust as we finish this site.  In the mean time, if you're at Devcon, you should check out our programming at Devcon for more information.  You can also ask questions in our Telegram group at [t.me/zupass](https://t.me/zupass).

### Resources


The POD and GPC libraries are available for JavaScript/TypeScript developers.  Start by looking at the [tutorial code here](https://github.com/proofcarryingdata/zupass/tree/main/examples/pod-gpc-example), then you can take a look at the specific packages listed below.

All code is open-source and available in the Zupass [repo](https://github.com/proofcarryingdata/zupass).  Detailed documentation is at [docs.pcd.team](https://docs.pcd.team/).  We hope you'll give them a try and [tell us](mailto:support@zupass.org) what you think.

### @pcd/gpc

Links: [NPM](https://www.npmjs.com/package/@pcd/gpc), [tutorial](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/gpcExample.ts#L88), [docs](https://docs.pcd.team/modules/_pcd_gpc.html), [code](https://github.com/proofcarryingdata/zupass/tree/main/packages/lib/gpc)

Allows creation of GPC proofs using high-level configuration.  The config compiler picks the right ZK circuit, and generates the circuit inputs to prove or verify as needed.

### @pcd/proto-pod-pcd-artifacts

Links: [NPM](https://www.npmjs.com/package/@pcd/proto-pod-gpc-artifacts), [tutorial](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/gpcExample.ts#L155), [docs](https://github.com/proofcarryingdata/snark-artifacts/blob/pre-release/README.md), [code](https://github.com/proofcarryingdata/snark-artifacts/tree/pre-release/packages/proto-pod-gpc)

This package contains the binary artifacts (proving and verification keys, witness generators) needed for GPC proofs in the initial `proto-pod-gpc` family.  These are large, but you'll only need a few of them, not the whole package.  Read more information about how to use tehse artifacts [here](/gpc/artifacts).

### @pcd/gpcircuits

Links: [NPM](https://www.npmjs.com/package/@pcd/gpcircuits), [docs](https://docs.pcd.team/modules/_pcd_gpcircuits.html), [code](https://github.com/proofcarryingdata/zupass/tree/main/packages/lib/gpcircuits/circuits)

Contains the modular ZK circuits used to generate GPC proofs.  You don't need to look at this code to use GPCs, but you can use this code as the basis of your own ZK circuits using PODs, or to enable on-chain verifiaction.

### @pcd/gpc-pcd

Links: [NPM](https://www.npmjs.com/package/@pcd/gpc-pcd), [tutorial](https://github.com/proofcarryingdata/zupass/blob/main/examples/pod-gpc-example/src/gpcExample.ts#L376), [docs](https://docs.pcd.team/modules/_pcd_gpc_pcd.html), [code](https://github.com/proofcarryingdata/zupass/tree/main/packages/pcd/gpc-pcd)

Allows GPC proofs to be generated about PODs in your Zupass.  A GPCPCD is developer/hacker friendly, displaying the proof configuration and POD values directly.  Most apps don't need to interact directly with GPCPCDs, but should instead prefer to use the [Z API](/z-api/introduction).

## Related APIs

- GPC proofs are built using [PODs](/gpc/introduction)
- Interact with PODs in Zupass using the [Z API](/z-api/introduction)

### Examples


## Tutorials and Examples

See the [Getting Started](/pod/getting-started) page for an initial intro, but if you prefer reading a tutorial in the form of heavily commented code, you can find it [here](https://github.com/proofcarryingdata/zupass/tree/main/examples/pod-gpc-example).

### ZuKyc

An end-to-end developer demo showing how PODs & GPCs can be used to apply for a loan by proving a borrower's identity, age, and income.  You can build and run the demo locally, or using the pre-deployed servers.

- Detailed tutorial here: [README](https://github.com/proofcarryingdata/zukyc/blob/main/README.md)
- Check out the app here: [ZooLender](https://zukyc-gpc-verifier.vercel.app/), [code](https://github.com/proofcarryingdata/zukyc)

## Live Apps

These apps all use GPCs in production.  More live apps coming soon.  They're launching at Devcon now...

### FrogJuice

Squeeze your frogs and get rewards on-chain!  FrogJuice is the first demonstration of on-chain verification of GPC proofs, using frog PODs issued by FrogCrypto.

- Try it at [FrogJuice.fun](https://frogjuice.fun)
- [Source code](https://github.com/BuidlGuidl/frogcrypto-squeeze)

### Meerkat

Meerkat is a Q&A app for live audience engagement. With Meerkat, attendees of an event or conference can submit questions, upvote their favorites, share reactions, and collect session artifacts as PODs. At an event, each talk will display a QR code, making it easy to join the Q&A by verifying your access through your privacy-preserving Zupass access ticket.

- Check out the app here: [Meerkat](https://meerkat.events)
- [Source code](https://github.com/meerkat-events/meerkat)

### Frog Zone

A multiplayer game showcasing adanced cryptography primitives.  Frog Zone uses zero knowledge proofs via GPC to authenticate users to a game experience built on multi-party fully homeomorphic encryption (MPFHE). Frog Zone is playable only at Devcon 7 SEA.


## z-api Documentation

### Introduction

The Z-API brings the power of [programmable cryptography](https://0xparc.org/blog/programmable-cryptography-1) to your web app, allowing you to create provable data and zero-knowledge proofs in as few as 10 lines of code. Powered by Zupass, this unlocks new options for privacy, user control of data, and interoperability.

# What's a Zapp?

[Zupass](https://zupass.org) provides users with a private data store and a suite of cryptographic tools to make zero-knowledge proofs about that data. Zapps are apps which integrate with Zupass to provide those features to their users.

A Zapp might use data from the user's Zupass store to authenticate them, or might store new data in Zupass. Because the data store is owned by the user, that data is available to any other applications the user choose to share it with.

Zapps are just regular web applications, and they can also read and write data from other remote sources, such as back-end services or platforms. Your Zapp does not have to use Zupass as its only, or primary, data store. However, you _can_ build Zapps which work only with data stored in Zupass if you want to.

# Why Zapps?

Zero-knowledge proofs offer powerful new ways to build applications, limiting the need for centralized APIs and promoting privacy and security. By using cryptographic signatures to authenticate data, we avoid relying on API responses as single sources of truth. Instead, users can both create and receive signed data, and choose to share proofs about that data with others.

Zapps are applications built with this architecture in mind. By using the [POD](../pod/introduction) data format and [general-purpose zero-knowledge circuits](../gpc/introduction), they can support these new workflows.

Traditionally, building apps that use zero-knowledge proofs has been hard, requiring knowledge of ZK circuits programming, and creation of new ZK-friendly data formats. [POD](../pod/introduction) and [GPC](../gpc/introduction) together provide a toolkit for solving these problems. The Z API provides an integration with [Zupass](https://zupass.org), which gives your app a pre-built POD store with end-to-end encrypted synchronization for privacy and portability, as well as management of cryptographic keys and identity.

# Z API

The Z API allows you to embed Zupass in your application, making it easy to get started with PODs and GPCs, using the user's existing Zupass identity and cryptographic keys. Crucially, this allows your Zapp to access data created by other Zapps. Providing just a handful of simple API methods, we can enable the creation, storage, and management of PODs, and the creation of GPC proofs about them.

# What's next?

- Dive in to write code on the [Getting Started](./getting-started) page.
- Read more about the [POD](/pod/introduction) and [GPC](/pod/introduction) technologies used by the Z-API.
- Read or watch more about Zupass and the Z-API in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [app development](/learning#app-development) talks for more about the Z-API and how it's used in real apps.
- Read more about specific Z-API development topics using the links on the sidebar.

### Getting Started


import { PackageManagers } from "starlight-package-managers";
import { Aside } from '@astrojs/starlight/components';

The Zapp SDK lets you build JavaScript apps which connect to Zupass, giving you access to programmable cryptography tools which enable secure and private interaction with the user's personal data.

In this guide we'll look at how to get started as an app developer, connect to Zupass, and interact with the user's data store.

## Installation

To get started with the Zapp SDK, you will need to install the `@parcnet-js/app-connector` package, using your preferred package manager:

<PackageManagers
  frame="none"
  pkgManagers={["npm", "yarn", "pnpm", "bun"]}
  pkg="@parcnet-js/app-connector"
/>

## Import the connector

Next, import the connector package in your application code:

```ts wrap=true title="src/main.ts"
import { connect } from "@parcnet-js/app-connector";
```

## Connect to Zupass

To connect, you will need to define some data about your Zapp, select a host HTML element, and choose a Zupass URL to connect to.

### Defining your Zapp

To define your Zapp:
```ts wrap=true title="src/main.ts"
import { connect, Zapp } from "@parcnet-js/app-connector";

const myZapp: Zapp = {
  name: "My Zapp Name",
  permissions: {
    REQUEST_PROOF: { collections: ["Apples", "Bananas"] },
    SIGN_POD: {},
    READ_POD: { collections: ["Apples", "Bananas"] },
    INSERT_POD: { collections: ["Apples", "Bananas"] },
    DELETE_POD: { collections: ["Bananas"] },
    READ_PUBLIC_IDENTIFIERS: {}
  }
}
```

Try to give your Zapp a simple, memorable name that is clearly tied to its branding or domain name.

#### Permissions

When connecting for the first time, your Zapp will request permissions from Zupass. These permissions determine what the Zapp will be allowed to do with user data:

<table>
<tr>
<th>Permission</th><th>Effects</th><th>Parameters</th>
</tr>
<tr>
<td>READ_PUBLIC_IDENTIFIERS</td>
<td>This permission allows your Zapp to read the user's public key and Semaphore commitments.</td>
<td>
_None._
</td>
</tr>
<tr>
<td>REQUEST_PROOF</td>
<td>This permission allows your Zapp to request zero-knowledge proofs from the user.</td>
<td>
**collections**: The names of the collections that your Zapp requires access to.
</td>
</tr>
<tr>
<td>SIGN_POD</td>
<td>This permission allows your Zapp to request the signing of a POD with the user's identity.</td>
<td>
_None._
</td>
</tr>
<tr>
<td>READ_POD</td>
<td>This permission allows your Zapp to read any POD from the specified collections.</td>
<td>
**collections**: The names of the collections that your Zapp requires access to.
</td>
</tr>
<tr>
<td>INSERT_POD</td>
<td>This permission allows your Zapp to insert PODs to the specified collections.</td>
<td>
**collections**: The names of the collections that your Zapp requires access to.
</td>
</tr>
<tr>
<td>DELETE_POD</td>
<td>This permission allows your Zapp to delete any POD from the specified collections.</td>
<td>
**collections**: The names of the collections that your Zapp requires access to.
</td>
</tr>
</table>

"Collections" are distinct groups of PODs, and allow the user to grant different levels of access to different Zapps.

<Aside type="tip" title="Built-in collections">
Zupass has a built-in collection called "Tickets". Your Zapp can also specify a new collection which doesn't already exist, and create it by inserting PODs into it.

The "Tickets" collection is special, and some tickets cannot be deleted even if your Zapp requests this permission.
</Aside>

### Select an HTML element

The app connector works by inserting an `<iframe>` element into the web page, and uses this to exchange messages with Zupass. To avoid interfering with other elements on your page, you should add an element that the app connector can use. For example, your HTML might look something like this:
```html wrap=true title="public/index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Zapp</title>
  </head>
  <body>
    <div id="app-connector">
      <!-- This element will be used by the app connector -->
    </div>
    <div id="app">
      <!-- Your HTML or mounted components go here -->
    </div>
    <script type="module" src="/src/app.ts"></script>
  </body>
</html>
```

Here we're using an element with the ID `app-connector` to host the `iframe`. It's important that your application does not change this element once the app connector has started.

### Choose a Zupass URL

Finally, you must choose the Zupass URL you want to connect to. The client is identified by the URL it's hosted on. For Zupass production, the URL is `https://zupass.org`, but you might be running a local development version on something like `http://localhost:3000`. Or you might be running another client altogether, in which case use the URL that it's hosted at.

### Putting it all together

Now we're ready to connect:

```ts wrap=true title="src/main.ts"
import { connect, Zapp } from "@parcnet-js/app-connector";

// The details of our Zapp
const myZapp: Zapp = {
  name: "My Zapp Name",
  permissions: {
    READ_PUBLIC_IDENTIFIERS: {}
  }
}

// The HTML element to host the <iframe>
const element = document.getElementById("parcnet-app-connector") as HTMLElement;

// The URL to Zupass
const clientUrl = "http://localhost:3000";

// Connect!
const z = await connect(myZapp, element, clientUrl);
```

The resulting `z` variable will contain an API wrapper. The API reference for this is [here](/api/classes/parcnetapi/).

## Creating and reading data

User data is stored in [POD](https://pod.org/) format. This is a cryptography-friendly data format which enables the creation of proofs about the structure, content, and provenance of individual data objects, or groups of data objects.

### Signing PODs

New PODs are created by signing a data object. This is straightforward:

```ts wrap=true title="src/main.ts"
const data: PODEntries = {
  greeting: { type: "string", value: "Hello, world" },
  magic_number: { type: "int", value: 1337n },
  email_address: { type: "string", value: "test@example.com" }
}

const signedPOD = await z.pod.sign(data);

// Will print the entries we defined above:
console.log(signedPOD.content.asEntries());

// Will print the unique signature of the POD:
console.log(signedPOD.signature);
```

The result of the `sign` method is a `POD` data object. Internally, this stores the data entries as a Merkle tree, but it's not necessary to understand how this works.

The POD's unique signature is the signed hash of the Merkle root, but you can treat it as an opaque identifier. The signature is created using a private key belonging to the user, which is managed by Zupass - your app does not have direct access to the private key.

### Inserting PODs to the data store

Once you have a POD, you can insert it to the data store:

```ts wrap=true title="src/main.ts"
await z.pod.collection("CollectionName").insert(signedPOD);
```

Zupass is responsible for saving the data and synchronizing it between devices, so your app doesn't need to worry about how this data is persisted.

The collection name should be one of the collections that your Zapp requested permission to insert PODs to. Attempting to insert to a collection without permissions will fail.

In the above example, we're inserting the POD that we created by requesting a signature from the client, but your app could also have a back-end service which signs PODs using your own private key. Those PODs can be inserted using the `insert` API. For example:

```ts wrap=true title="src/main.ts"
// Fetch the serialized POD from the server
const response = await fetch('https://your-api.com/get-pod');
const serializedPOD = await response.text();

// Deserialize the POD
const pod = POD.deserialize(serializedPOD);

// Now you can insert the POD into the data store
await z.pod.collection("CollectionName").insert(pod);
```

The details of your backend may be different, but this approach works for PODs produced by any external source.

### Deleting PODs

Your app can also delete PODs for which it knows the signature:

```ts wrap=true title="src/main.ts"
await z.pod.collection("CollectionName").delete(signature);
```

This tells the client to drop the POD from the user's data store.

### Querying for PODs

To read PODs from the data store, you can define queries which describe certain criteria for PODs:

```ts wrap=true title="src/main.ts"
import * as p from "@parcnet-js/podspec";

const query = p.pod({
  entries: {
    greeting: { type: "string" },
    magic_number: { type: "int" }
  }
});
const queryResult = await z.pod.collection("CollectionName").query();
```

This will return any PODs which have entries matching the description. The result is an array of `POD` objects, which will be empty if no matching results are found.

Queries can contain more advanced constraints:

```ts wrap=true title="src/main.ts"
import * as p from "@parcnet-js/podspec";

const validGreetings = [
  { type: "string", value: "Hello, world" },
  { type: "string", value: "Ahoy there!" },
  { type: "string", value: "Good morning, starshine. The Earth says hello!" }
];

const validNumberRange = { min: 1000n, max: 1500n };

const query = p.pod({
  entries: {
    greeting: { type: "string", isMemberOf: validGreetings },
    magic_number: { type: "int", inRange: validNumberRange }
  }
});

const queryResult = await z.pod.collection("CollectionName").query(query);
```

This query provides a list of valid strings for the `greeting` entry, and a range of valid numbers for the `magic_number` entry. You can use these features to construct very specific queries for specific PODs.

### Subscribing to queries

TODO

## Making and verifying proofs about data

PODs are designed to make it easy to create cryptographic proofs about their structure, content, and provenance. These proofs are created using **G**eneral **P**urpose **C**ircuits, or **GPC**s.

GPCs allow you to describe aspects of a POD, and make proofs about that POD without revealing all of the underlying data. For example, you could prove that you have a POD signed by a particular public key without revealing the POD's content, or prove that you have a POD with a particular entry whose value lies in a certain range or belongs to a list, without revealing the exact value.

### Making proofs

To create a proof, you must create a **proof request**. The proof request contains information about what you would like to prove, and the user can decide whether to allow the proof. Here's an example:

```ts wrap=true title="src/main.ts"
const validGreetings = [
  { type: "string", value: "Hello, world" },
  { type: "string", value: "Ahoy there!" },
  { type: "string", value: "Good morning, starshine. The Earth says hello!" }
];

const validNumberRange = { min: 1000n, max: 1500n };

const result = await z.gpc.prove({ 
  request: {
    pods: {
      pod1: {
        pod: {
          entries: {
            greeting: { type: "string", isMemberOf: validGreetings },
            magic_number: { type: "int", inRange: validNumberRange },
            email_address: { type: "string" }
          }
        }
      },
      {
        revealed: { email_address: true }
      }
    }
  }
});
```

This proof will require a POD with a valid `greeting` and `magic_number`, and will also reveal the value of the `email_address` entry.

The result has a field `success` which is set to `true` if the proof was created successfully. 

If `success` is false then the result also contains an `error` field containing an error message.

If `success` is true then the result has a further three fields:
- `proof`, which contains the cryptographic proof for later verification
- `boundConfig`, which contains the proof configuration
- `revealedClaims`, which contains the "claims" about the data which can be verified with reference to the `proof`

In the example above, the `revealedClaims` field would contain something like this:
```ts wrap=true
{
  pods: {
    pod1: {
      entries: {
        email_address: {
          type: "string",
          value: "test@example.com"
        }
      }
    }
  },
  membershipLists: {
    { type: "string", value: "Hello, world" },
    { type: "string", value: "Ahoy there!" },
    { type: "string", value: "Good morning, starshine. The Earth says hello!" }
  }
}
```

The `membershipLists` contains information about the list membership rules that apply to some entries, and contains information that was part of the input. However, the `pods` section contains details about the specific POD that the user selected, which was not part of your input.

### Verifying proofs

TODO

## User identity

Users have identity credentials, which their clients help them to manage. You can request certain public information about the user's identity using the API.

### Semaphore v3 commitment

The user's [Semaphore](https://semaphore.pse.dev/) v3 commitment can be retrieved like this:

```ts wrap=true title="src/main.ts"
const commitment = await z.identity.getSemaphoreV3Commitment();
```

The commitment is a `bigint` and uniquely identifies the user.

### Semaphore v4 commitment

The user's [Semaphore](https://semaphore.pse.dev/) v4 commitment can be retrieved like this:

```ts wrap=true title="src/main.ts"
const commitment = await z.identity.getSemaphoreV4Commitment();
```

The commitment is a `bigint` and uniquely identifies the user.


### Public key

The user's [Semaphore](https://semaphore.pse.dev/) v4 public key can be retrieved like this:

```ts wrap=true title="src/main.ts"
const commitment = await z.identity.getPublicKey();
```

The public key is a `string` and uniquely identifies the user.

## What's next?

- Check out the rest of the pages of this guide for deeper dives on various aspects of the Z-API.
- Read more about the [POD](/pod/introduction) and [GPC](/pod/introduction) technologies used by the Z-API.
- Read or watch more about Zupass and the Z-API in both vision and technical detail on the [Learning](/learning) page.  In particular, check out the [app development](/learning#app-development) talks for more about the Z-API and how it's used in real apps.

### Api Reference


Guides lead a user through a specific task they want to accomplish, often with a sequence of steps.
Writing a good guide requires thinking about what your users are trying to do.

## Further reading

- Read [about how-to guides](https://diataxis.fr/how-to-guides/) in the Diátaxis framework

### Ticket Proofs

import { Aside } from '@astrojs/starlight/components';
import { PackageManagers } from "starlight-package-managers";

Zupass tickets are [PODs](https://www.pod.org), Provable Object Datatypes. This means that they're ZK-friendly, and it's easy to make proofs about them.

ZK proofs in Zupass are used to reveal information about some POD-format data that the user has. This might involve directly revealing specific POD entries, such as the e-mail address associated with an event ticket. Or, it might involve revealing that an entry has a value in a given range, or with a value that matches a list of valid values. Or, it might even involve revealing that a set of related entry values match a sets of values from a list.

<Aside type="note" title="What are entries?">
PODs are collections of "entries", which are name and value pairs, where values have a type of `string` (for text), `int` (for integers), `cryptographic` (for very large integers), and `eddsa_pubkey` (for EdDSA public keys).

Zero-knowledge proofs in Zupass work by proving that a POD's entries match certain criteria, without necessarily revealing _how_ they match it. For example, you could prove that a `birthdate` entry of type `int` is below a certain number, indicating that a person was born before a certain date, without revealing what the `birthdate` value is.
</Aside>

Zupass allows you to configure proofs by providing a set of criteria describing one or more PODs that the user must have. If the user has matching PODs, they can make a proof and share it with someone else - such as with your application or another user of your app. As the app developer, it's your job to design the proof configuration.

Because this system is very flexible, it can also be intimidating at first. Mistakes can be subtle, and might result in a proof that doesn't really prove what you want it to. To help with this, there's a specialized library for preparing ticket proof requests, `ticket-spec`. This guide will explain how to use it.

# Quick Start

Below you will find more detailed background on ticket proofs. But if you just want to get started, here's how to do it:

Following the [Getting Started](getting-started) guide, install the App Connector module and verify that you can connect to Zupass.

Next, install the `ticket-spec` package:

<PackageManagers
  frame="none"
  pkgManagers={["npm", "yarn", "pnpm", "bun"]}
  pkg="@parcnet-js/ticket-spec"
/>

Then, you can create a ticket proof request, and use it to create a proof:

```ts wrap=true title="src/main.ts"
import { ticketProofRequest } from "@parcnet-js/ticket-spec";

const request = ticketProofRequest({
  classificationTuples: [
    // If you know the public key and event ID of a POD ticket, you can specify
    // them here, otherwise delete the object below.
    {
      signerPublicKey: "PUBLIC_KEY",
      eventId: "EVENT_ID"
    }
  ],
  fieldsToReveal: {
    // The proof will reveal the attendeeEmail entry
    attendeeEmail: true
  },
  externalNullifier: {
    type: "string",
    value: "APP_SPECIFIC_NULLIFIER"
  }
});

const gpcProof = await z.gpc.prove({ request: request.schema });
```

This will create a GPC proof which proves that the ticket has a given signer public key and event ID, and also reveals the `attendeeEmail` address for the ticket.

If you know the signer public key and event ID of a ticket then you can specify those in the `classificationTuples` array, but for getting started you can delete those values if you don't know which ones to specify.

The result should be an object containing `proof`, `boundConfig`, and `revealedClaims` fields. For now, we can ignore `proof` and `boundConfig`, and focus on `revealedClaims`, which, given the above example, should look like this:

```ts wrap=true
{
  "pods": {
    "ticket": {
      "entries": {
        "attendeeEmail": {
          "type": "string",
          "value": "test@example.com"
        }
      },
      "signerPublicKey": "MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY"
    }
  },
  "owner": {
    "externalNullifier": {
      "type": "string",
      "value": "APP_SPECIFIC_NULLIFIER"
    },
    "nullifierHashV4": 18601332455379395925267579735435017582946383130668625217012137367106027237345
  },
  "membershipLists": {
    "allowlist_tuple_ticket_entries_$signerPublicKey_eventId": [
      [
        {
          "type": "eddsa_pubkey",
          "value": "MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY"
        },
        {
          "type": "string",
          "value": "fca101d3-8c9d-56e4-9a25-6a3c1abf0fed"
        }
      ]
    ]
  }
}
```

As we saw in the original proof request, the `attendeeEmail` entry is revealed: `revealedClaims.pods.ticket.entries.attendeeEmail` contains the value.

To understand how this works, read on!

# Configuring a ticket proof request

Ticket proofs enable the user to prove that they hold an event ticket matching certain criteria. They also allow the user to selectively reveal certain pieces of data contained in the ticket, such as their email address or name.

A typical use-case for ticket proofs is to prove that the user has a ticket to a specific event, and possibly that the ticket is of a certain "type", such as a speaker ticket or day pass. To determine this, we need to specify two or three entries:
- Public key of the ticket signer or issuer
- The unique ID of the event
- Optionally, the unique ID of the product type, if the event has multiple types of tickets

For example, if you want the user to prove that they have a ticket to a specific event, then you want them to prove the following:

- That their ticket POD was signed by the event organizer's ticket issuance key
- That their ticket has the correct event identifier
- That their ticket is of the appropriate type, if you want to offer a different experience to holders of different ticket types

## How to specify ticket details

To match a ticket based on the above criteria, you must specify _either_ pairs of public key and event ID, or triples of public key, event ID, and product ID. For example:

```ts wrap=true title="src/main.ts"
const pair = [{
  publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
  eventId: "ab9306be-019f-40d9-990d-88826a15fde5"
}];
const triple = [{
  publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
  eventId: "ab9306be-019f-40d9-990d-88826a15fde5",
  productId: "672c6ff1-9947-41d4-8876-4ef1e3317f08" 
}];
```

The first example, containing only a public key and event ID, will match any ticket which has those attributes. The second is more precise, requiring that the ticket have a specific product type.

It's possible to specify _multiple_ pairs or triples. For example:
```ts wrap=true title="src/main.ts"
const pairs = [
  {
    publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
    eventId: "ab9306be-019f-40d9-990d-88826a15fde5"
  },
  {
    publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
    eventId: "5ddb8781-b893-4187-9044-9ac229368aac"
  }
]
```

These would be used like this:

```ts wrap=true title="src/main.ts" {2-11}
const request = ticketProofRequest({
  classificationTuples: [
    {
      publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
      eventId: "ab9306be-019f-40d9-990d-88826a15fde5"
    },
    {
      publicKey: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho",
      eventId: "5ddb8781-b893-4187-9044-9ac229368aac"
    }
  ],
  fieldsToReveal: {
    // The proof will reveal the attendeeEmail entry
    attendeeEmail: true
  },
  externalNullifier: {
    type: "string",
    value: "APP_SPECIFIC_NULLIFIER"
  }
});
```

In this case, the proof request will match any ticket which matches _either_ of the above pairs. If you provide more, then the ticket just needs to match any of the provided pairs.

This underlines an important principle: when the proof is created, you might not know _which_ pair of values the user's ticket matches. This is by design, and is part of how ZK proofs provide privacy. If you only need to know that the user has a ticket matching a list of values, but don't need to know exactly which ticket the user has, then by default that information will not 

## What gets revealed in a ticket proof

If you have specified pairs or triples of public key, event ID and (optionally) product ID, then the list of valid values will be revealed in the proof. This might be the _only_ information you want to reveal: the proof discloses that the user has a ticket which satisfies these criteria, but no more.

However, you might want the proof to disclose more information about the ticket. There are two further types of information that a proof might reveal: a "nullifier hash", a unique value derived from the user's identity, and a subset of the ticket's entries.

### Nullifier hash

A nullifier hash is a unique value which is derived from the user's identity, but which cannot be used to determine the user's identity. Typically this is used to pseudonymously identify a user: if the same user creates two proofs, both proofs will have the same nullifier hash, giving the user a consistent identity, but not one that can be used to determine their public key or other information.

The nullifier hash requires an "external nullifier", a value which your application must provide. This ensures that the nullifier hash is derived from _both_ the user's identity and a value that your application provides. This means that the nullifier hash that the user has when creating proofs for your application will be different to the nullifier hash they have when creating proofs for another application.

### Revealed entries

Proofs can also directly reveal the values held in certain entries, meaning that the `revealedClaims` object in the proof result will be populated with values from the ticket that the use selects when making the proof. In the Quick Start example above, the `attendeeEmail` entry is revealed, but you can reveal any of the ticket's entries by setting them in the `fieldsToReveal` parameter:

```ts wrap=true title="src/main.ts" {10-13}
const request = ticketProofRequest({
  classificationTuples: [
    // If you know the public key and event ID of a POD ticket, you can specify
    // them here, otherwise delete the object below.
    {
      signerPublicKey: "PUBLIC_KEY",
      eventId: "EVENT_ID"
    }
  ],
  fieldsToReveal: {
    // Reveal the unique ticket ID
    ticketId: true,
    // Reveal the attendee's name
    attendeeName: true,
    // Reveal if the ticket is checked in
    isConsumed: true
  },
  externalNullifier: {
    type: "string",
    value: "APP_SPECIFIC_NULLIFIER"
  }
});
```

## Watermark

You can add a watermark to your proof, which allows you to uniquely identify a proof. Precisely which value to use for the watermark depends on your application and use-case, but you might use a unique session ID, or a single-use number generated by your application.

If you add a watermark to your proof request, you can check the watermark when later verifying the proof. A typical workflow might involve your client application requesting a random number from your server, which stores the number. The number is passed as a watermark in the proof request, and then you can send the proof to the server for verification. The server then checks that the watermark is equal to the random number it generated. By requiring the watermark to equal some single-use secret value, you ensure that the client cannot re-use a previously-generated proof.

## Verifying a ticket proof

Once a proof has been made, you can verify it.

Typically, verification is done by a different person, computer, or program than the one that produced the proof. You don't really need to verify a proof that you just created on the same computer, but if you received a proof from someone else, or if you have an application which sends proofs between, say, a client and a server then you will want to verify any proofs that you receive.

Verification covers a few important principles:
- That, given a `revealedClaims` object which makes certain statements, a proof configuration, and a proof object, the proof object really does correspond to the configuration and revealed claims. If we didn't check this, then the `revealedClaims` might contain data for which there is no proof!
- That the configuration really is the one that you expect it to be. This is important because a proof might really match a set of claims and a configuration, but if the configuration is not the one you expect then the claims might not be valid for your use-case.

### Proof requests

To make this easy to get right, we have a concept of "proof requests". When you call `ticketProofRequest` as described above, you're creating a proof request object which can be used to... request a proof. However, you can also use the proof request when _verifying_ a proof, to ensure that the proof was produced in response to the correct request.

If you're verifying the proof in the browser using the Z API, you can do so like this:

```ts wrap=true title="src/main.ts"
import { ticketProofRequest } from "@parcnet-js/ticket-spec";

const request = ticketProofRequest({
  /**
   * As per examples above
   */
});

const { proof, boundConfig, revealedClaims } = await z.gpc.prove({ request: request.schema });

const isVerified = await z.gpc.verifyWithProofRequest(proof, boundConfig, revealedClaims, proofRequest);
```

This performs both of the checks described above. Of course, since you're using the same proof request object in both cases, you already know that the proof matches the request!

However, you can use a similar technique when verifying the same proof in another environment, such as on a server:

```ts wrap=true title="src/server.ts"
import { ticketProofRequest } from "@parcnet-js/ticket-spec";
import { gpcVerify } from "@pcd/gpc";
import isEqual from "lodash/isEqual";

const request = ticketProofRequest({
  /**
   * This should be the same proof request that you use on the client.
   * It would be a good idea to define your proof request in a shared module or
   * package.
   */
});

// Here we assume that some kind of web framework such as Express is being used
// to receive these variables via a HTTP POST or similar.
const { proof, boundConfig, revealedClaims } = httpRequest.body;

const { proofConfig, membershipLists, externalNullifier, watermark } = request.getProofRequest();

// This is necessary to satisfy the type of `GPCBoundConfig`
proofConfig.circuitIdentifier = boundConfig.circuitIdentifier;

// These changes ensure that the revealed claims say what they are supposed to
revealedClaims.membershipLists = membershipLists;
revealedClaims.watermark = watermark;
if (revealedClaims.owner) {
  revealedClaims.owner.externalNullifier = externalNullifier;
}

const isVerified = await gpcVerify(
  proof,
  proofConfig as GPCBoundConfig,
  revealedClaims,
  pathToGPCArtifacts // This may vary depending on your installation
);
```

This ensures that our verified proof not only matches the claims that were sent, but that claims are those we expect them to be.

## Devcon Ticket Proofs

Above we outlined a generic approach to making proofs about tickets. If you're looking to make a proof about ownership of a Devcon ticket specifically, you can use this configuration:

```ts wrap=true title="src/main.ts" {4-5}
const request = ticketProofRequest({
  classificationTuples: [
    {
      signerPublicKey: "YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs",
      eventId: "5074edf5-f079-4099-b036-22223c0c6995"
    }
  ],
  fieldsToReveal: {
    // Reveal the attendee's name
    attendeeName: true,
    // Reveal the attendee's email
    attendeeEmail: true
  },
  externalNullifier: {
    type: "string",
    value: "APP_SPECIFIC_NULLIFIER"
  }
});
```
### Queries

PODs are organized into collections, but often we want to find a specific set of PODs within a collection, or across multiple collections, based on the data the PODs contain. Queries allow us to describe the characteristics of a POD, and find those PODs which match our criteria.

Here's an example query:

```ts
import * as p from "@parcnet-js/podspec";

// Declare the query
const query = p.pod({
  entries: {
    string_entry: { type: "string" },
    int_entry: { type: "int", inRange: { min: 0n, max: 100n } },
    optional_entry: { 
      type: "optional",
      innerType: {
        type: "cryptographic"
      }
    }
  }
});

// Run the query
const result = await z.pod.collection("Apples").query(query);
```

Queries work by specifying constraints on some POD entries. For a POD to match the query, it must have all of the specified entries (except for those explicitly marked as `optional`), and those entries must satisfy the criteria provided.

Queries can use the following criteria:

## type

If an entry is specified at all, it must have a type. Types can be the following:
- `string`, for text entries
- `int`, for integers, up to a maximum of 64 bits (signed), meaning 9,223,372,036,854,775,807 to -9,223,372,036,854,775,808
- `cryptographic`, for larger numbers, typically used for hashes
- `eddsa_pubkey`, for string-encoded EdDSA public keys

Examples:
```ts
const query = p.pod({
  entries: {
    string_entry: { type: "string" },
    int_entry: { type: "int" },
    cryptographic_entry: { type: "cryptographic" },
    eddsa_pubkey_entry: { type: "eddsa_pubkey" },
    optional_entry: { 
      type: "optional",
      innerType: {
        type: "cryptographic"
      }
    }
  }
});

// Would match a POD with these entries:
{
  string_entry: { type: "string", value: "example" },
  int_entry: { type: "int", value: 8388608n },
  cryptographic_entry: { type: "cryptographic", value: 117649n },
  eddsa_pubkey_entry: { type: "eddsa_pubkey", value: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho" }
  // Since `optional_entry` is optional, this POD matches
}

// Would also match:
{
  string_entry: { type: "string", value: "example" },
  int_entry: { type: "int", value: 8388608n },
  cryptographic_entry: { type: "cryptographic", value: 117649n },
  eddsa_pubkey_entry: { type: "eddsa_pubkey", value: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho" },
  // If optional_entry is present, it must be a `cryptographic`, so this matches
  optional_entry: { type: "cryptographic", value: 390625n }
}

// Would not match:
{
  string_entry: { type: "string", value: "example" },
  cryptographic_entry: { type: "cryptographic", value: 117649n },
  eddsa_pubkey_entry: { type: "eddsa_pubkey", value: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho" }
  // int_entry is missing, so this doesn't match
}

// Would not match
{
  string_entry: { type: "string", value: "example" },
  // int_entry has a different type compared to the query, so this doesn't match
  int_entry: { type: "string", value: "i'm a string now" },
  cryptographic_entry: { type: "cryptographic", value: 117649n },
  eddsa_pubkey_entry: { type: "eddsa_pubkey", value: "2C4B7JzSakdQaRlnJPPlbksW9F04vYc5QFLy//nuIho" }
}
```

The type `optional` is also available. `optional` entries can be missing. However, they have an `innerType` value, which can contain filter criteria to apply to the entry if it exists, which can include the real type:
```ts
const query = p.pod({
  entries: {
    optional_entry: { 
      type: "optional",
      innerType: {
        type: "int",
        inRange: { min: 500n, max: 5000n }
      }
    }
  }
});
```

## isMemberOf/isNotMemberOf

These filters allow us to specify lists of values, and check that the entries for a POD either match (with `isMemberOf`) or do _not_ match (with `isNotMemberOf`) the list that we provide.

For example:

```ts
const query = p.pod({
  entries: {
    animal_type: {
      type: "string",
      isMemberOf: [
        { type: "string", value: "Fox" },
        { type: "string", value: "Rabbit" },
        { type: "string", value: "Camel" }
      ]
    }
  }
})
```

This example would match any POD with an `animal_type` entry, so long as that entry is a `string`, and it has a value of `"Fox"`, `"Rabbit"`, or `"Camel"`.

## inRange

For `int` values, we can check if they lie with in a minimum and maximum range.

For example:
```ts
const query = p.pod({
  entries: {
    age: {
      type: "int",
      min: 25n,
      max: 1500n
    }
  }
})
```

This query would match any POD with an `age` entry, so long as that entry is an `int` with a value between 25 and 1500, inclusive.

## Tuples

Tuples work similar to `isMemberOf` and `isNotMemberOf`, but allow us to compare against a set of entries at the same time.

For example, say a POD represents data about songs. The POD has entries for `"artist"`, and `"year_published"`. If we want to find every song by Beyoncé, we could write a query like this:

```ts
const query = p.pod({
  entries: {
    artist: { 
      type: "string",
      isMemberOf: [
        { type: "string", value: "Beyoncé"}
      ]
    }  
  }
})
```

If we want to find every song by _either_ Beyoncé or Taylor Swift, we could write a query like this:

```ts
const query = p.pod({
  entries: {
    artist: { 
      type: "string",
      isMemberOf: [
        { type: "string", value: "Beyoncé"},
        { type: "string", value: "Taylor Swift" }
      ]
    }  
  }
})
```

If we wanted to find every song by either Beyoncé or Taylor Swift that was published in 2016, we could do this:

```ts
const query = p.pod({
  entries: {
    artist: { 
      type: "string",
      isMemberOf: [
        { type: "string", value: "Beyoncé"},
        { type: "string", value: "Taylor Swift" }
      ]
    },
    year_published: {
      type: "int",
      isMemberOf: [
        { type: "int", value: 2016n }
      ]
    }
  }
})
```

But what if we want to find _either_ songs by Beyoncé from 2016, _or_ songs by Taylor Swift from 2020? For this, we need tuples!

We could write a query like this:

```ts
const query = p.pod({
  entries: {
    artist: { 
      type: "string"
    },
    year_published: {
      type: "int"
    }
  },
  tuples: [
    {
      entries: ["artist", "year_published"],
      isMemberOf: [
        [
          { type: "string", value: "Beyoncé" },
          { type: "int", value: 2016n }
        ],
        [
          { type: "string", value: "Taylor Swift" },
          { type: "int", value: 2020n }
        ]
      ]
    }
  ]
})
```

Note that the query has to declare the types of the entries to match on, and then later refers to those entries in the `tuples` object.

## Non-entry values

In addition to matching on the POD's entries, we can also match on the POD's `signerPublicKey` and `signature`.

For example:
```ts
const query = p.pod({
  entries: {
    name: { type: "string" }
  },
  signerPublicKey: {
    isMemberOf: [
      "MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY",
      "YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs"
    ]
  },
  signature: {
    isMemberOf: [
      "rcjfuTtbn8cQ3wnBDR1GLN5WLl3TJRCvIBtnWsn0ZqB2QS5336v/7+xwi+RHRu8/wDJ1VDCgHFDDmlBZL1kVBA"
    ]
  }
})
```

This example is a bit contrived, but shows how it is possible to query for a POD by either the public key of the signer, or by the signature of the POD. Querying by signature is not particularly useful, since signatures are hard to guess, but if you happen to know a POD's signature then you could query to see if the user has it.

Querying by signer public key is more useful: if you know the public key of a signer, such as the organizer of an event or the operator of a game, you can query for PODs signed by them.

## Virtual entries in tuples

The signer public key can also be used as a "virtual" entry in a tuple. For example, if you are playing a game in which magical items are signed by different wizards, you might want to use a tuple like this:

```ts
const gandalfPublicKey = "MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY";
const sarumanPublicKey = "YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs";

const query = p.pod({
  entries: {
    item_type: {
      type: "string"
    }
  },
  tuples: [
    {
      entries: ["item_type", "$signerPublicKey"],
      isMemberOf: [
        [
          { type: "string", value: "Staff" },
          { type: "eddsa_pubkey", value: gandalfPublicKey }
        ],
        [
          { type: "string", value: "Palantir" },
          { type: "eddsa_pubkey", value: sarumanPublicKey }
        ]
      ]
    }
  ]
})
```

This query will match on either a POD with an `item_type` entry of `"Staff"` signed by Gandalf's public key, or a POD with an `item_type` entry of `"Palantir"`, signed by Saruman's public key. Note that unlike matching directly on the public key, here we represent the public key as though it were an entry in the POD, meaning that we use `{ type: "eddsa_pubkey", value: "MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY" }` rather than the string `"MolS1FubqfCmFB8lHOSTo1smf8hPgTPal6FgpajFiYY"` directly.
### Examples


## Tutorials and Examples

See the [Getting Started](/pod/getting-started) page for an initial intro, but if you prefer learning from interactive code, check out the example app below.

### ZApp Test client

A fully function Zapp client with executable examples.

- Run the test client [here](https://zapp-test-client.onrender.com/).
- Source is available in the Zupass repo [here](https://github.com/proofcarryingdata/zupass/tree/main/examples/test-zapp).

## Live Apps

These apps all use the Z-API in production.  More live apps coming soon.  They're launching at Devcon now...

### Frogcrypto

A game of collecting cryptographic frogs.  [Frogcrypto](https://frogcrypto.xyz) is re-launching at Devcon 7 SEA with new features to discover.  More details here after the conferene.

### Meerkat

Meerkat is a Q&A app for live audience engagement. With Meerkat, attendees of an event or conference can submit questions, upvote their favorites, share reactions, and collect session artifacts as PODs. At an event, each talk will display a QR code, making it easy to join the Q&A by verifying your access through your privacy-preserving Zupass access ticket.

- Check out the app here: [Meerkat](https://meerkat.events)
- [Source code](https://github.com/meerkat-events/meerkat)

### Frog Lab

Derive novel substances from your frogs.  The lab uses the Z-API to select frogs, and generate novel substances saved back to Zupass as PODs.

- Try it out at [shuljin.engineering](https://shulgin.engineering)
- [Source code](https://github.com/Moving-Castles/shulgin.engineering)

### FrogJuice

Squeeze your frogs and get rewards on-chain!  FrogJuice is the first demonstration of on-chain verification of GPC proofs, using frog PODs issued by FrogCrypto.

- Try it at [FrogJuice.fun](https://frogjuice.fun)
- [Source code](https://github.com/BuidlGuidl/frogcrypto-squeeze)

