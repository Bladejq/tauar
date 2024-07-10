import pool from "../db.mjs";

class OrderRepository {
  static async createOrder(user, products, order) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const newOrder = (await pool.query(
        "INSERT INTO orders (user_id, address, delivery_time, payment_method, verification_code) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [user.id, order.address, order.deliveryTime, order.paymentMethod, verificationCode]
    )).rows[0];

    const query = "INSERT INTO order_details (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *";

    await Promise.all(
        products.map((product) =>
            pool.query(query, [
                newOrder.id,
                product.id,
                product.quantity,
            ])
        )
    );

    const orderDetails = (await pool.query(
        "SELECT * FROM order_details WHERE order_id = $1", [newOrder.id]
    )).rows;

    return { ...newOrder, products: orderDetails, verificationCode }; 
}

  static async getOrders(user) {
    const orders = (await pool.query("SELECT * FROM orders WHERE user_id = $1", [user.id])).rows;
    const orderDetails = (await pool.query(
      `SELECT
                o.id,
                o.status,
                od.product_id,
                od.quantity,
                p.title,
                p.price,
                p.thumbnail
            FROM
                orders o
            JOIN
                order_details od ON o.id = od.order_id
            JOIN
                products p ON od.product_id = p.id
            JOIN
                users u ON o.user_id = u.id
            WHERE
                u.id = $1`,
      [user.id]
    )).rows;

    const result = orders.map(order => {
      const details = orderDetails.filter(orderItem => orderItem.id == order.id);
      const totalPrice = details.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return {
        ...order,
        totalPrice,
        products: details
      };
    });

    return result;
  }

  static async editOrderStatus(orderId, newStatus) {
    const validStatuses = ['Күтілуде', 'Жеткізілу барысында', 'Жеткізілді', 'Жойылды'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }

    const updatedOrder = (await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [newStatus, orderId]
    )).rows[0];

    return updatedOrder;
  }


  static async getAllOrders() {
    const orders = (await pool.query(
      `SELECT
            o.id,
            o.user_id,
            o.status,
            o.verification_code,
            u.firstname,
            u.lastname,
            u.email,
            o.order_date,
            o.address,
            o.delivery_time,
            o.payment_method,
            od.product_id,
            od.quantity,
            p.title,
            p.thumbnail,
            p.price
        FROM
            orders o
        JOIN
            order_details od ON o.id = od.order_id
        JOIN
            products p ON od.product_id = p.id
        JOIN
            users u ON o.user_id = u.id`
    )).rows;
    return orders;
  }

}

export default OrderRepository;
