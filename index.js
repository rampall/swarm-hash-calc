import { Bee, NULL_STAMP, SWARM_GATEWAY_URL } from '@ethersphere/bee-js'
import pkg from '@fairdatasociety/bmt-js'
const { makeChunk } = pkg

async function compareHashes() {
  const text = "hello world"
  const data = new TextEncoder().encode(text)

  console.log('Testing with text:', text)
  console.log('Data bytes:', Array.from(data))
  console.log('Data length:', data.length, 'bytes\n')

  // Method 1: Using bee-js (requires Bee node)
  console.log('=== Method 1: bee-js (upload to Bee node) ===')
  try {
    const bee = new Bee(SWARM_GATEWAY_URL)

    const { reference } = await bee.uploadData(
      NULL_STAMP,
      data
    )

    const beeHash = reference.toHex()
    console.log('Bee hash:', beeHash)
    console.log('Length:', beeHash.length, 'chars\n')
  } catch (error) {
    console.error('Error with bee-js:', error.message)
    console.log('Make sure Bee node is running on http://localhost:1633\n')
  }

  // Method 2: Using bmt-js (local calculation)
  console.log('=== Method 2: bmt-js (local calculation) ===')
  const chunk = makeChunk(data)
  const bmtHash = Buffer.from(chunk.address()).toString('hex')
  console.log('BMT hash:', bmtHash)
  console.log('Length:', bmtHash.length, 'chars\n')

  // Additional info
  console.log('=== Additional Information ===')
  console.log('Chunk data length:', chunk.data().length, 'bytes (padded to 4KB)')
  console.log('Chunk span:', Buffer.from(chunk.span()).toString('hex'))
  console.log('Chunk payload length:', chunk.payload.length, 'bytes')

  return bmtHash
}

// Run the comparison
compareHashes()
  .then(hash => {
    console.log('\n✓ BMT hash calculated successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n✗ Error:', error)
    process.exit(1)
  })
