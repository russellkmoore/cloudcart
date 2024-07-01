import { Str, Num, Int } from "@cloudflare/itty-router-openapi";

export const AddItemRequest = {
	userId: new Str({ required: true }), 
	productId: new Str({ required: true }), 
	name: new Str({ required: true }), 
	price: new Str({ required: true }),
	quantity: new Int({ required: true }),
};

export const RemoveItemRequest = {
	userId: new Str({ required: true }), 
	productId: new Str({ required: true }), 
};

export const UpdateItemRequest = {
	userId: new Str({ required: true }), 
	productId: new Str({ required: true }), 
	newQuantity: new Int({ required: true }),
};
