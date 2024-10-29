#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dechat {
    use ink::prelude::string::String;
    use ink::storage::Mapping;

    // #[derive(Default, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Room {
        pub id: u64,
        pub name: String,
        pub message_count: u64,
        pub creator: AccountId,
    }

    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Message {
        pub id: u64,
        pub content: String,
        pub creator: AccountId,
        pub created_at: u64,
    }

    #[ink(storage)]
    pub struct Dechat {
        rooms: Mapping<u64, Room>, // room_id -> Room
        room_count: u64,
        room_messages: Mapping<(u64, u64), Message>, // room_id, message_id -> Message
    }

    #[derive(Debug, PartialEq, Eq, Copy, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        ExistedRoom,
    }

    impl Dechat {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                rooms: Mapping::default(),
                room_count: 0,
                room_messages: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn get_room(&self, id: u64) -> Option<Room> {
            self.rooms.get(id)
        }

        #[ink(message)]
        pub fn create_room(&mut self, id: u64, name: String) -> Result<(), Error> {
            let caller = self.env().caller();
            if self.rooms.contains(id) {
                return Err(Error::ExistedRoom);
            }
            let room = Room {
                id,
                name,
                message_count: 0,
                creator: caller,
            };
            self.rooms.insert(id, &room);
            self.room_count = self.room_count.checked_add(1).unwrap();
            Ok(())
        }

        #[ink(message)]
        pub fn delete_room(&mut self, id: u64) {
            let caller = self.env().caller();
            let room = self.rooms.get(id).unwrap();
            assert_eq!(room.creator, caller);
            self.rooms.remove(id);
            self.room_count = self.room_count.checked_sub(1).unwrap();
        }

        #[ink(message)]
        pub fn send_message(&mut self, room_id: u64, content: String) {
            let caller = self.env().caller();
            let room = self.rooms.get(room_id).unwrap();
            let message_id = room.message_count;
            let message = Message {
                id: message_id,
                content,
                creator: caller,
                created_at: self.env().block_timestamp(),
            };
            self.room_messages.insert((room_id, message_id), &message);
            let new_message_count = room.message_count.checked_add(1).unwrap();
            self.rooms.insert(
                room_id,
                &Room {
                    id: room.id,
                    name: room.name,
                    message_count: new_message_count,
                    creator: room.creator,
                },
            );
        }

        #[ink(message)]
        pub fn get_message(&self, room_id: u64, message_id: u64) -> Option<Message> {
            self.room_messages.get((room_id, message_id))
        }

        #[ink(message)]
        pub fn get_message_count(&self, room_id: u64) -> u64 {
            self.rooms.get(room_id).unwrap().message_count
        }

        #[ink(message)]
        pub fn get_message_paginate(&self, room_id: u64, offset: u64, limit: u64) -> Vec<Message> {
            let room = self.rooms.get(room_id).unwrap();
            let mut messages = Vec::new();
            for i in offset..(offset + limit) {
                if i >= room.message_count {
                    break;
                }
                let message = self.room_messages.get((room_id, i)).unwrap();
                messages.push(message);
            }
            messages
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
            let _ = dechat.create_room(1, "Room 1".to_string());
            let room = dechat.get_room(1).unwrap();
            assert_eq!(room.id, 1);
            assert_eq!(room.name, "Room 1");
            assert_eq!(room.message_count, 0);
            assert_eq!(dechat.room_count, 1);
        }

        #[ink::test]
        fn delete_room_works() {
            let mut dechat = Dechat::new();
            let _ = dechat.create_room(1, "Room 1".to_string());
            dechat.delete_room(1);
            assert_eq!(dechat.room_count, 0);
        }

        #[ink::test]
        fn send_message_works() {
            let mut dechat = Dechat::new();
            let _ = dechat.create_room(1, "Room 1".to_string());
            dechat.send_message(1, "Hello".to_string());
            let message = dechat.room_messages.get((1, 0)).unwrap();
            assert_eq!(message.content, "Hello");
        }

        #[ink::test]
        fn get_message_works() {
            let mut dechat = Dechat::new();
            let _ = dechat.create_room(1, "Room 1".to_string());
            dechat.send_message(1, "Hello".to_string());
            let message = dechat.get_message(1, 0).unwrap();
            assert_eq!(message.content, "Hello");
        }

        #[ink::test]
        fn get_message_paginate_works() {
            let mut dechat = Dechat::new();
            let _ = dechat.create_room(1, "Room 1".to_string());
            dechat.send_message(1, "Hello".to_string());
            dechat.send_message(1, "World".to_string());
            let messages = dechat.get_message_paginate(1, 0, 2);
            assert_eq!(messages.len(), 2);
            assert_eq!(messages[0].content, "Hello");
            assert_eq!(messages[1].content, "World");
        }
    }
}
