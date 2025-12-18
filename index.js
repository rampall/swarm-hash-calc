import { Bee, NULL_STAMP, SWARM_GATEWAY_URL } from '@ethersphere/bee-js'
import pkg from '@fairdatasociety/bmt-js'
import { readFile } from 'fs/promises'
const { makeChunk, makeChunkedFile } = pkg

async function loadData(filePath) {
  if (filePath) {
    const data = await readFile(filePath)
    console.log('Testing with file:', filePath)
    console.log('Data length:', data.length, 'bytes\n')
    return data
  } else {
    const text = "hello world"
    const data = new TextEncoder().encode(text)
    console.log('Testing with text:', text)
    console.log('Data bytes:', Array.from(data))
    console.log('Data length:', data.length, 'bytes\n')
    return data
  }
}

async function uploadToBee(data) {
  console.log('=== Method 1: bee-js (upload to Bee node) ===')
  try {
    const bee = new Bee(SWARM_GATEWAY_URL)
    const { reference } = await bee.uploadData(NULL_STAMP, data)
    const hash = reference.toHex()
    console.log('Bee hash:', hash)
    console.log('Length:', hash.length, 'chars\n')
    return hash
  } catch (error) {
    console.error('Error with bee-js:', error.message)
    console.log('Make sure Bee node is running on http://localhost:1633\n')
    return null
  }
}

function calculateLocalHash(data) {
  console.log('=== Method 2: bmt-js (local calculation) ===')

  if (data.length <= 4096) {
    return calculateSingleChunkHash(data)
  } else {
    return calculateMultiChunkHash(data)
  }
}

function calculateSingleChunkHash(data) {
  const chunk = makeChunk(data)
  const hash = Buffer.from(chunk.address()).toString('hex')

  console.log('BMT hash:', hash)
  console.log('Length:', hash.length, 'chars\n')

  console.log('=== Additional Information ===')
  console.log('Single chunk file')
  console.log('Chunk data length:', chunk.data().length, 'bytes (padded to 4KB)')
  console.log('Chunk span:', Buffer.from(chunk.span()).toString('hex'))
  console.log('Chunk payload length:', chunk.payload.length, 'bytes')

  return hash
}

function calculateMultiChunkHash(data) {
  const chunkedFile = makeChunkedFile(data)
  const hash = Buffer.from(chunkedFile.address()).toString('hex')

  console.log('BMT hash:', hash)
  console.log('Length:', hash.length, 'chars\n')

  console.log('=== Additional Information ===')
  console.log('Multi-chunk file')
  console.log('Number of chunks:', chunkedFile.leafChunks.length)
  console.log('Total data size:', data.length, 'bytes')

  return hash
}

async function compareHashes(filePath) {
  const data = await loadData(filePath)
  await uploadToBee(data)
  const localHash = calculateLocalHash(data)
  return localHash
}

// Run the comparison
const filePath = process.argv[2] || null

compareHashes(filePath)
  .then(hash => {
    console.log('\n✓ BMT hash calculated successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n✗ Error:', error)
    process.exit(1)
  })
