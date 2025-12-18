# hash-calc

Calculate Swarm content hashes using BMT (Binary Merkle Tree) algorithm.

## Description

This tool demonstrates two methods for calculating Swarm content hashes:

1. **bee-js**: Upload data to a Bee node and retrieve the hash
2. **bmt-js**: Calculate the hash locally without a Bee node

## Installation

```bash
npm install
```

## Usage

```bash
node index.js
```

The script calculates the BMT hash for the text "hello world" and displays:

- The hash value (64-character hex string)
- Data length and bytes
- Chunk information (span, payload, padding)

```
Testing with text: hello world
Data bytes: [
  104, 101, 108, 108,
  111,  32, 119, 111,
  114, 108, 100
]
Data length: 11 bytes

=== Method 1: bee-js (upload to Bee node) ===
Error with bee-js: Request failed with status code 404
Make sure Bee node is running on http://localhost:1633

=== Method 2: bmt-js (local calculation) ===
BMT hash: 92672a471f4419b255d7cb0cf313474a6f5856fb347c5ece85fb706d644b630f
Length: 64 chars

=== Additional Information ===
Chunk data length: 4096 bytes (padded to 4KB)
Chunk span: 0b00000000000000
Chunk payload length: 11 bytes

✓ BMT hash calculated successfully
```

## Dependencies

- `@ethersphere/bee-js` - Interact with Swarm Bee nodes
- `@fairdatasociety/bmt-js` - Local BMT hash calculation

## Notes

- The bee-js method requires a running Bee node at `http://localhost:1633`
- The bmt-js method works offline and produces the same hash
