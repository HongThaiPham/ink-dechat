# Dechat

Dechat is a decentralized chat application built using the [ink!](https://github.com/paritytech/ink) smart contract language for the Substrate blockchain framework.

## Features

- Create chat rooms
- Join chat rooms
- Send messages in chat rooms
- Retrieve messages from chat rooms

## Usage

Build the smart contract:

```bash
pop build
```

Run the tests:

```bash
pop test contract
```

Deploy the smart contract:

Local

```bash
pop up contract --constructor new --suri //Alice --dry-run
pop up contract --constructor new --suri //Alice
```

Pop Network

```bash
pop up contract --constructor new --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```

Call the smart contract:

- Create a room

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message create_room --args \""Alice Room"\" --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz --dry-run

pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message create_room --args \""Alice Room"\" --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz -x

```

- Get room info

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message get_room --args 1 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```

- Join room `0`

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message join_room --args 1 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz --dry-run

pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message join_room --args 1 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz -x
```

- Get room count

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message get_room_count --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```

- Get messages count of room 1

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message get_message_count --args 1 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```

- Send a message to room 4

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message send_message --args 4 \""Hello guys"\" --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz --dry-run

pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message send_message --args 4 \""Hello guys"\" --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz -x
```

- Get message 1 of room 4

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message get_message --args 4 1 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```

- Get message list from room 1 from id 1 to 10

```bash
pop call contract --contract 5HMWeAYSdgbrrntzXUidGTWAJU5cUUBaQyZBHibp2H24NdDg --message get_message_paginate --args 4 1 10 --suri 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a --url wss://rpc1.paseo.popnetwork.xyz
```
