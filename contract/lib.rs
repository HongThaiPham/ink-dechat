#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dechat {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    const MAX_ITEMS: u64 = 10;
    const MAX_ROOM_CAN_JOIN: u64 = 50;

    // #[derive(Default, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Room {
        pub id: u64,            // room id
        pub name: String,       // Display name of the room
        pub message_count: u64, // how many messages in this room?
        pub creator: AccountId, // who create this room?
    }

    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Message {
        pub id: u64,            // message id
        pub content: String,    // message content
        pub creator: AccountId, // who send this message?
        pub created_at: u64,    // when this message was sent?
    }

    #[ink(storage)]
    pub struct Dechat {
        rooms: Mapping<u64, Room>,                   // room_id -> Room
        room_count: u64,                             // how many rooms is created?
        room_messages: Mapping<(u64, u64), Message>, // room_id, message_id -> Message
        user_rooms: Mapping<AccountId, Vec<u64>>,    // user -> if of rooms that user joined
    }

    #[derive(Debug, PartialEq, Eq, Copy, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        Unauthorized,
        RoomExisted,
        RoomNotExisted,
        AlreadyJoined,
        MaxRoomReached,
        CannotAccess,
    }

    impl Default for Dechat {
        fn default() -> Self {
            Self::new()
        }
    }

    impl Dechat {
        // Initializes a new instance of the `Dechat` contract.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                rooms: Mapping::default(),
                room_count: 0,
                room_messages: Mapping::default(),
                user_rooms: Mapping::default(),
            }
        }

        // Retrieves a room by its ID.
        #[ink(message)]
        pub fn get_room(&self, id: u64) -> Option<Room> {
            self.rooms.get(id)
        }

        #[ink(message)]
        pub fn create_room(&mut self, name: String) -> Result<(), Error> {
            let caller = self.env().caller();

            // Check if the caller has reached the max room limit.
            let mut room_ids = self.user_rooms.get(&caller).unwrap_or_default();
            if room_ids.len() as u64 == MAX_ROOM_CAN_JOIN {
                return Err(Error::MaxRoomReached);
            }

            let next_count = self.room_count.checked_add(1).unwrap();

            let room = Room {
                id: next_count,
                name,
                message_count: 0,
                creator: caller,
            };
            self.rooms.insert(next_count, &room);
            self.room_count = next_count;

            // Add the room to the user's room list.
            room_ids.push(next_count);
            self.user_rooms.insert(caller, &room_ids);
            Ok(())
        }

        // Join a room with the specified ID.
        #[ink(message)]
        pub fn join_room(&mut self, id: u64) -> Result<(), Error> {
            if !self.is_room_existed(id) {
                return Err(Error::RoomNotExisted);
            }
            let caller = self.env().caller();

            // Check if the caller has reached the max room limit.
            let mut room_ids = self.user_rooms.get(&caller).unwrap_or_default();
            if room_ids.len() as u64 == MAX_ROOM_CAN_JOIN {
                return Err(Error::MaxRoomReached);
            }

            if room_ids.contains(&id) {
                return Err(Error::AlreadyJoined);
            }
            // Add the room to the user's room list.
            room_ids.push(id);
            self.user_rooms.insert(caller, &room_ids);
            Ok(())
        }

        #[ink(message)]
        pub fn send_message(&mut self, room_id: u64, content: String) -> Result<(), Error> {
            if !self.is_room_existed(room_id) {
                return Err(Error::RoomNotExisted);
            }
            let caller = self.env().caller();

            // Check if the caller has joined the room.
            let room_ids = self.user_rooms.get(&caller).unwrap_or_default();

            if !room_ids.contains(&room_id) {
                ink::env::debug_println!("ZZZ");
                return Err(Error::CannotAccess);
            }
            let room = self.rooms.get(room_id).unwrap();

            // Create a new message.
            let next_message_count = room.message_count.checked_add(1).unwrap();
            let message = Message {
                id: next_message_count,
                content,
                creator: caller,
                created_at: self.env().block_timestamp(),
            };

            // Add the message to the room.
            self.room_messages
                .insert((room_id, next_message_count), &message);

            // Update the room message count.
            self.rooms.insert(
                room_id,
                &Room {
                    id: room.id,
                    name: room.name,
                    message_count: next_message_count,
                    creator: room.creator,
                },
            );
            Ok(())
        }

        #[ink(message)]
        pub fn get_message(&self, room_id: u64, message_id: u64) -> Option<Message> {
            let caller = self.env().caller();

            if !self.is_room_existed(room_id)
                || !self.user_rooms.get(&caller).unwrap().contains(&room_id)
            {
                return None;
            }
            self.room_messages.get((room_id, message_id))
        }

        #[ink(message)]
        pub fn get_message_count(&self, room_id: u64) -> u64 {
            if !self.is_room_existed(room_id) {
                return 0;
            }
            self.rooms.get(room_id).unwrap().message_count
        }

        #[ink(message)]
        pub fn get_message_paginate(
            &self,
            room_id: u64,
            from: u64,
            to: u64,
        ) -> Option<Vec<Message>> {
            let caller = self.env().caller();
            ink::env::debug_println!("caller: {:?}", caller);
            if !self.is_room_existed(room_id)
                || !self.user_rooms.get(&caller).unwrap().contains(&room_id)
            {
                return None;
            }
            let message_count = self.get_message_count(room_id);
            ink::env::debug_println!("message_count: {:?}", message_count);
            if message_count == 0 {
                return None;
            }
            let to = to.min(message_count).checked_add(1).unwrap();
            assert!(from.le(&to) && to.checked_sub(from).unwrap().le(&MAX_ITEMS));
            let mut messages = Vec::new();
            for i in from..to {
                let message = self.room_messages.get((room_id, i)).unwrap();
                messages.push(message);
            }
            Some(messages)
        }

        #[ink(message)]
        pub fn get_room_count(&self) -> u64 {
            self.room_count
        }

        fn is_room_existed(&self, id: u64) -> bool {
            self.rooms.contains(id)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn init_contract_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set the contract as callee and Alice as caller.
            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let dechat = Dechat::new();
            assert_eq!(dechat.room_count, 0);
        }

        #[ink::test]
        fn create_room_works() {
            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();
            let room = dechat.get_room(1).unwrap();
            assert_eq!(room.id, 1);
            assert_eq!(room.name, "Room 1");
            assert_eq!(room.message_count, 0);
            assert_eq!(dechat.room_count, 1);
        }

        #[ink::test]
        fn join_room_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set the contract as callee and Alice as caller.
            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();

            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            dechat.join_room(1).unwrap();
            let room_ids = dechat.user_rooms.get(accounts.bob).unwrap();
            assert_eq!(room_ids.len(), 1);
            assert_eq!(room_ids[0], 1);
        }

        #[ink::test]
        fn send_message_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set the contract as callee and Alice as caller.
            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();

            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            dechat.join_room(1).unwrap();
            dechat.send_message(1, "Hello".to_string()).unwrap();
            let message = dechat.room_messages.get((1, 1));
            assert!(message.is_some());
            let message = message.unwrap();
            assert_eq!(message.creator, accounts.bob);
        }

        #[ink::test]
        fn send_message_failed_when_room_not_existed() {
            let mut dechat = Dechat::new();
            let result = dechat.send_message(1, "Hello".to_string());
            assert_eq!(result, Err(Error::RoomNotExisted));
        }

        #[ink::test]
        fn send_message_failed_when_user_not_joined() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set the contract as callee and Alice as caller.
            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();

            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let result = dechat.send_message(1, "Hello".to_string());
            assert_eq!(result, Err(Error::CannotAccess));
        }

        #[ink::test]
        fn get_message_works() {
            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();
            dechat.send_message(1, "Hello".to_string()).unwrap();
            let message = dechat.get_message(1, 1);
            assert!(message.is_some());
            let message = message.unwrap();
            assert_eq!(message.content, "Hello");
        }

        #[ink::test]
        fn get_message_paginate_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set the contract as callee and Alice as caller.
            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let mut dechat = Dechat::new();
            let _ = dechat.create_room("Room 1".to_string());
            let _ = dechat.send_message(1, "Hello Bob".to_string());

            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            dechat.join_room(1).unwrap();
            let _ = dechat.send_message(1, "Hello Alice".to_string());

            let messages = dechat.get_message_paginate(1, 1, 3);
            assert!(messages.is_some());
            let messages = messages.unwrap();
            assert_eq!(messages.len(), 2);
            // assert_eq!(messages[0].content, "Hello");
            // assert_eq!(messages[1].content, "World");
        }

        #[ink::test]
        fn get_room_count_works() {
            let mut dechat = Dechat::new();
            dechat.create_room("Room 1".to_string()).unwrap();
            dechat.create_room("Room 2".to_string()).unwrap();
            assert_eq!(dechat.get_room_count(), 2);
        }
    }
}
