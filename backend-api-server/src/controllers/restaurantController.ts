export class RestaurantController {
    private restaurants: Array<{ id: number; name: string; location: string }> = [
        { id: 1, name: "Pizza Place", location: "123 Main St" },
        { id: 2, name: "Sushi Spot", location: "456 Elm St" },
        { id: 3, name: "Burger Joint", location: "789 Oak St" },
    ];

    public getRestaurants(req: any, res: any): void {
        res.json(this.restaurants);
    }

    public getRestaurantById(req: any, res: any): void {
        const restaurantId = parseInt(req.params.id, 10);
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: "Restaurant not found" });
        }
    }
}