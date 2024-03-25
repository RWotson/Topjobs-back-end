const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Package = require('../models/packageSchema');

// Create a package
router.post('/packages', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const existingPackage = await Package.findOne({ name });
    if (existingPackage) {
      return res.status(400).json({ error: 'Package name already exists!' });
    }

    const newPackage = new Package({ name, price, description });
    await newPackage.save();

    res.status(201).json({ message: 'Package created successfully!', package: newPackage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Get all packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({ packages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Update a package
router.put('/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const package = await Package.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );

    if (!package) {
      return res.status(404).json({ error: 'Package not found!' });
    }

    res.status(200).json({ message: 'Package updated successfully!', package });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Delete all packages
router.delete('/packages/deleteAll', async (req, res) => {
  try {
    const { packageIds } = req.body;

    const result = await Package.deleteMany({ _id: { $in: packageIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No packages found!' });
    }

    res.json({ message: 'Packages deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Delete a package
router.delete('/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const package = await Package.findByIdAndDelete(id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found!' });
    }

    res.status(200).json({ message: 'Package deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

module.exports = router;
