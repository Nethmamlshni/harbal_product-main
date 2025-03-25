import Product from "../Models/Product.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, state, price, discount, stock, tags, ingredients, benefits, usageInstructions, shelfLife, expiryDate, weight, organicCertification, origin } = req.body;
    const images = req.files ? req.files.map(file => file.path) : []; // Handling image uploads

    const newProduct = new Product({name, description,category,state,price,discount,stock,tags,images,ingredients,benefits,usageInstructions,shelfLife,expiryDate,weight,organicCertification, origin});
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, state, organic, sortBy, sortOrder } = req.query;
    let filter = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (state) filter.state = state;
    if (organic === 'true') filter.organicCertification = true;
    if (minPrice || maxPrice) filter.price = {
      ...(minPrice ? { $gte: minPrice } : {}),
      ...(maxPrice ? { $lte: maxPrice } : {})
    };

    let query = Product.find(filter);

    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      query = query.sort({ [sortBy]: order });
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, state, price, discount, stock, tags, ingredients, benefits, usageInstructions, shelfLife, expiryDate, weight, organicCertification, origin } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, state, price, discount, stock, tags, ingredients, benefits, usageInstructions, shelfLife, expiryDate, weight, organicCertification, origin, ...(images.length > 0 && { images }) },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
