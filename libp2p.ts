
import { createLibp2p } from 'libp2p'
import { mdns } from '@libp2p/mdns'
import { tcp } from '@libp2p/tcp'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify, identifyPush } from '@libp2p/identify'
import { bootstrap } from '@libp2p/bootstrap'
import { webSockets } from '@libp2p/websockets'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { webRTC } from '@libp2p/webrtc'
import * as filters from '@libp2p/websockets/filters'
import { echo } from '@libp2p/echo'
import { ping } from '@libp2p/ping'

const createLibp2pNode = async (options: any) => {
  
  const libp2p = await createLibp2p({
    datastore:options.datastore,
    start: false,
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/0',
        '/ip4/0.0.0.0/tcp/0/ws',
        '/webrtc'
      ]
    },
    transports: [
      // tcp(),
      webSockets({
        // this allows non-secure WebSocket connections for purposes of the demo
        filter: filters.all
      }),
      // // support dialing/listening on WebRTC addresses
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 1
      }) 
    ],
    streamMuxers: [
      yamux()
    ],
    connectionEncrypters: [
      noise()
    ],
    peerDiscovery: [
      mdns({
        interval: 20e3
      }),
      bootstrap({
        list: [
          '/ip4/83.229.121.237/tcp/1333/ws/p2p/12D3KooWEq3MZgCV8czWpGUinsBmjedmwN93nXSWrxhLyQeYMD6u'
        ]
      })

    ],
    connectionGater: {
      denyDialMultiaddr: () => {
        // by default we refuse to dial local addresses from browsers since they
        // are usually sent by remote peers broadcasting undialable multiaddrs and
        // cause errors to appear in the console but in this example we are
        // explicitly connecting to a local node so allow all addresses
        return false
      }
    },
    services:{
      identify: identify(),
      identifyPush:identifyPush(),
      ping: ping(),
      pubsub: gossipsub(),
      dht:kadDHT({
        protocol:'/wfg/kad/1.0.0',
        clientMode:false
      })
    },
  });

  return libp2p;
}

export { createLibp2pNode };
