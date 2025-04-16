import * as Account from "./query/account";
import * as Attribute from "./query/attribute";
import * as AttributeMeta from "./query/attributemeta";
import * as Auth from "./query/auth";
import * as Category from "./query/category";
import * as Customer from "./query/customer";
import * as File from "./query/file";
import * as Order from "./query/order";
import * as OrderMeta from "./query/ordermeta";
import * as Post from "./query/post";
import * as PostMeta from "./query/postmeta";
import * as Search from "./query/search";
import * as Setting from "./query/setting";
import * as User from "./query/user";

const models = {
	Auth,
	Account,
	Category,
	Customer,
	User,
	File,
	Post,
	PostMeta,
	Setting,
	Search,
	Order,
	OrderMeta,
	Attribute,
	AttributeMeta,
};

export default models;
