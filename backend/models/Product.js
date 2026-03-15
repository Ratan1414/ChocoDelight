const supabase = require('../config/db');

class Product {
  static async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async findAll(filters = {}) {
    let query = supabase.from('products').select('*', { count: 'exact' });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.rating) {
      query = query.gte('rating', filters.rating);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    if (filters.excludeId) {
      query = query.neq('id', filters.excludeId);
    }

    if (filters.sort) {
      const [field, order] = filters.sort.split(':');
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { products: data, total: count };
  }

  static async updateById(id, updateData) {
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteById(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) throw error;
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }
}

module.exports = Product;
