import iAdapter from "../adapter/adapter";
import { Author } from "../model/author";
import { Book } from "../model/book";
import { User } from "../model/user";

export default interface iRepository {
    userRepository: iAdapter<User>;
    bookRepository: iAdapter<Book>;
    authorRepository: iAdapter<Author>;
}