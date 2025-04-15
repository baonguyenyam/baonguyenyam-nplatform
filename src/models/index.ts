import * as Account from "./admin/account";
import * as Attribute from "./admin/attribute";
import * as AttributeMeta from "./admin/attributemeta";
import * as Auth from "./admin/auth";
import * as Category from "./admin/category";
import * as Customer from "./admin/customer";
import * as File from "./admin/file";
import * as Order from "./admin/order";
import * as OrderMeta from "./admin/ordermeta";
import * as Post from "./admin/post";
import * as PostMeta from "./admin/postmeta";
import * as Search from "./admin/search";
import * as Setting from "./admin/setting";
import * as User from "./admin/user";

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
