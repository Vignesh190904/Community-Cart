const { supabase } = require('./src/config/supabaseClient');

async function createSampleData() {
  console.log('🔧 Creating sample data for testing...\n');

  try {
    // Step 1: Create a community if it doesn't exist
    console.log('1. Creating community...');
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id')
      .eq('name', 'Test Community')
      .single();

    let communityId;
    if (communityError && communityError.code === 'PGRST116') {
      // Community doesn't exist, create it
      const { data: newCommunity, error: createCommunityError } = await supabase
        .from('communities')
        .insert([{ 
          name: 'Test Community', 
          address: '123 Test Street, Test City',
          description: 'A test community for development'
        }])
        .select('id')
        .single();

      if (createCommunityError) {
        console.log('❌ Error creating community:', createCommunityError.message);
        return;
      }
      communityId = newCommunity.id;
      console.log('✅ Created community with ID:', communityId);
    } else if (communityError) {
      console.log('❌ Error checking community:', communityError.message);
      return;
    } else {
      communityId = community.id;
      console.log('✅ Found existing community with ID:', communityId);
    }

    // Step 2: Create categories
    console.log('\n2. Creating categories...');
    const categories = [
      { name: 'Vegetables', description: 'Fresh vegetables' },
      { name: 'Fruits', description: 'Fresh fruits' },
      { name: 'Dairy', description: 'Dairy products' },
      { name: 'Bakery', description: 'Bakery items' },
      { name: 'Grocery', description: 'General grocery items' }
    ];

    for (const category of categories) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category.name)
        .eq('community_id', communityId)
        .single();

      if (!existingCategory) {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert([{
            ...category,
            community_id: communityId
          }])
          .select('id, name')
          .single();

        if (categoryError) {
          console.log(`❌ Error creating category ${category.name}:`, categoryError.message);
        } else {
          console.log(`✅ Created category: ${newCategory.name}`);
        }
      } else {
        console.log(`✅ Category already exists: ${category.name}`);
      }
    }

    // Step 3: Create sample vendors (without address field)
    console.log('\n3. Creating sample vendors...');
    const vendors = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        shop_name: 'John\'s Fresh Market',
        phone: '+1234567890',
        business_name: 'John\'s Fresh Market',
        category: 'vegetables',
        description: 'Fresh vegetables and fruits',
        status: true,
        password_hash: 'hashed_password_john'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        shop_name: 'Jane\'s Bakery',
        phone: '+1234567891',
        business_name: 'Jane\'s Bakery',
        category: 'bakery',
        description: 'Fresh baked goods',
        status: true,
        password_hash: 'hashed_password_jane'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        shop_name: 'Mike\'s Dairy',
        phone: '+1234567892',
        business_name: 'Mike\'s Dairy',
        category: 'dairy',
        description: 'Fresh dairy products',
        status: true,
        password_hash: 'hashed_password_mike'
      }
    ];

    for (const vendorData of vendors) {
      // Check if vendor already exists
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('email', vendorData.email)
        .single();

      if (!existingVendor) {
        const { data: newVendor, error: vendorError } = await supabase
          .from('vendors')
          .insert([{
            ...vendorData,
            community_id: communityId,
            rating: 4.5,
            total_orders: Math.floor(Math.random() * 100),
            total_revenue: Math.floor(Math.random() * 10000)
          }])
          .select('id, name, shop_name')
          .single();

        if (vendorError) {
          console.log(`❌ Error creating vendor ${vendorData.name}:`, vendorError.message);
        } else {
          console.log(`✅ Created vendor: ${newVendor.name} (${newVendor.shop_name})`);
        }
      } else {
        console.log(`✅ Vendor already exists: ${vendorData.name}`);
      }
    }

    // Step 4: Create sample products
    console.log('\n4. Creating sample products...');
    
    // Get a vendor to associate products with
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('community_id', communityId)
      .limit(1)
      .single();

    if (vendor) {
      const products = [
        {
          name: 'Fresh Tomatoes',
          description: 'Organic red tomatoes',
          price: 2.99,
          stock: 50,
          unit: 'kg',
          available: true
        },
        {
          name: 'Whole Wheat Bread',
          description: 'Freshly baked whole wheat bread',
          price: 3.49,
          stock: 20,
          unit: 'loaf',
          available: true
        },
        {
          name: 'Fresh Milk',
          description: 'Organic whole milk',
          price: 4.99,
          stock: 30,
          unit: 'liter',
          available: true
        }
      ];

      // Get a category to associate products with
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('community_id', communityId)
        .limit(1)
        .single();

      for (const productData of products) {
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert([{
            ...productData,
            vendor_id: vendor.id,
            category_id: category?.id || null
          }])
          .select('id, name, price')
          .single();

        if (productError) {
          console.log(`❌ Error creating product ${productData.name}:`, productError.message);
        } else {
          console.log(`✅ Created product: ${newProduct.name} (₹${newProduct.price})`);
        }
      }
    }

    // Step 5: Create sample customers (with password_hash)
    console.log('\n5. Creating sample customers...');
    const customers = [
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '+1234567893',
        password_hash: 'hashed_password_123'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '+1234567894',
        password_hash: 'hashed_password_456'
      }
    ];

    for (const customerData of customers) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerData.email)
        .single();

      if (!existingCustomer) {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert([{
            ...customerData,
            community_id: communityId
          }])
          .select('id, name')
          .single();

        if (customerError) {
          console.log(`❌ Error creating customer ${customerData.name}:`, customerError.message);
        } else {
          console.log(`✅ Created customer: ${newCustomer.name}`);
        }
      } else {
        console.log(`✅ Customer already exists: ${customerData.name}`);
      }
    }

    console.log('\n🎉 Sample data creation completed!');
    console.log('\n📊 Summary:');
    console.log('- 1 Community created/found');
    console.log('- 5 Categories created/found');
    console.log('- 3 Vendors created/found');
    console.log('- 3 Products created');
    console.log('- 2 Customers created/found');

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

createSampleData();
