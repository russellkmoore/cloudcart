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
	public items: Item[] = [];
	public creationDate: Date = new Date();
	public dateLastUpdated: Date = new Date();

	addItem(item: Item): void {
		const existingItem = this.items.find(i => i.id === item.id);
		if (existingItem) {
			existingItem.quantity += item.quantity;
		} else {
			this.items.push(item);
		}
		this.dateLastUpdated = new Date();
	}

	removeItem(itemId: number): void {
		this.items = this.items.filter(item => item.id !== itemId);
		this.dateLastUpdated = new Date();
	}

	getTotalCost(): string {
		const total = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
		return total.toFixed(2);
	}

	getItems(): Item[] {
		return this.items;
	}

	getItemCount(): number {
		return this.items.reduce((count, item) => count + item.quantity, 0);
	}

	clearCart(): void {
		this.items = [];
		this.dateLastUpdated = new Date();
	}

	toJSON(): string {
		return JSON.stringify({
			cart: {
				items: this.getItems(),
				totalCost: this.getTotalCost(),
				itemCount: this.getItemCount(),
				creationDate: this.creationDate,
				dateLastUpdated: this.dateLastUpdated
			}
		});
	}

	fromJSON(json: string): void {
		const items = JSON.parse(json).cart.items;
		this.items = items.map((item: any) => new Item(item.id, item.name, item.price, item.quantity));
		this.creationDate = new Date(parsed.creationDate);
		this.dateLastUpdated = new Date(parsed.dateLastUpdated);
	}
}