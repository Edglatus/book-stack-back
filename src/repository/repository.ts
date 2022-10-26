import iAdapter from "../adapter/adapter";
import { iUserAdapter } from "../adapter/user";
import { Author } from "../model/author";
import { Book } from "../model/book";

export default interface iRepository {
    userRepository: iUserAdapter;
    bookRepository: iAdapter<Book>;
    authorRepository: iAdapter<Author>;
}