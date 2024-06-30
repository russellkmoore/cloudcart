// src/model/ShoppingCart.ts

// Item class
export class Item {
	constructor(
		public id: number,
		public name: string,
		public price: number,
		public quantity: number
	) {}
}

// ShoppingCart class
export class ShoppingCart {
	private items: Item[] = [];

	addItem(item: Item): void {
		const existingItem = this.items.find(i => i.id === item.id);
		if (existingItem) {
			existingItem.quantity += item.quantity;
		} else {
			this.items.push(item);
		}
	}

	removeItem(itemId: number): void {
		this.items = this.items.filter(item => item.id !== itemId);
	}

	getTotalCost(): number {
		return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
	}

	getItems(): Item[] {
		return this.items;
	}

	clearCart(): void {
		this.items = [];
	}

	toJSON(): string {
		return JSON.stringify(this.items);
	}

	fromJSON(json: string): void {
		const items = JSON.parse(json);
		this.items = items.map((item: any) => new Item(item.id, item.name, item.price, item.quantity));
	}
}