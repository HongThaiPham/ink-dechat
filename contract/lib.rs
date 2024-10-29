#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dechat {
    use ink::prelude::string::String;
    use ink::storage::Mapping;

    #[derive(Default, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Room {
        pub id: u64,
        pub name: String,
        pub message_count: u64,
    }

    #[ink(storage)]
    pub struct Dechat {
        rooms: Mapping<u64, Room>,
        room_count: u64,
    }

    impl Dechat {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                rooms: Mapping::default(),
                room_count: 0,
            }
        }

        #[ink(message)]
        pub fn get_room(&self, id: u64) -> Option<Room> {
            self.rooms.get(id)
        }

        #[ink(message)]
        pub fn create_room(&mut self, id: u64, name: String) {
            let room = Room {
                id,
                name,
                message_count: 0,
            };
            self.rooms.insert(id, &room);
            self.room_count += 1;
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

        /// We test a simple use case of our contract.
        #[ink::test]
        fn create_room_works() {
            let mut dechat = Dechat::new();
            dechat.create_room(1, "Room 1".to_string());
            let room = dechat.get_room(1).unwrap();
            assert_eq!(room.id, 1);
            assert_eq!(room.name, "Room 1");
            assert_eq!(room.message_count, 0);
            assert_eq!(dechat.room_count, 1);
        }
    }
}
