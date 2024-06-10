import Product from '../../models/product.js';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await Product.findAll();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
      }
      break;
    case 'POST':
      try {
        const { name, price, category, image } = req.body;
        const product = await Product.create({ name, price, category, image });
        res.status(201).json(product);
      } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
      }
      break;
    case 'PUT':
      try {
        const { productId, name, price, category, image } = req.body;
        const product = await Product.update(
          { name, price, category, image },
          { where: { productId } }
        );
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
      }
      break;
    case 'DELETE':
      try {
        const { productId } = req.body;
        await Product.destroy({ where: { productId } });
        res.status(200).json({ message: 'Product deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
