import { Str, Num, Int } from "@cloudflare/itty-router-openapi";

export const AddItemRequest = {
	userId: new Str({ example: "user123" }),
	productId: new Str({ example: "prod456" }),
	name: new Str({ example: "Sample Product" }),
	price: new Num({ example: "19.99" }),
	quantity: new Int({ example: "1" }),
};

export const RemoveItemRequest = {
	userId: new Str({ example: "user123" }),
	productId: new Str({ example: "prod456" }),
};

export const UpdateItemRequest = {
	userId: new Str({ example: "user123" }),
	productId: new Str({ example: "prod456" }),
	newQuantity: new Int({ example: "1" }),
};