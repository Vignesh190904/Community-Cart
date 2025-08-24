class Product {
  final String id;
  final String name;
  final String? description;
  final double price;
  final int stock;
  final bool available;
  final String? imageUrl;
  final String categoryId;
  final String vendorId;
  final String? categoryName;
  final String? vendorName;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.stock,
    required this.available,
    this.imageUrl,
    required this.categoryId,
    required this.vendorId,
    this.categoryName,
    this.vendorName,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] ?? 0.0).toDouble(),
      stock: json['stock'] ?? 0,
      available: json['available'] ?? false,
      imageUrl: json['image_url'],
      categoryId: json['category_id'] ?? '',
      vendorId: json['vendor_id'] ?? '',
      categoryName: json['categories']?['name'],
      vendorName: json['vendors']?['shop_name'],
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'stock': stock,
      'available': available,
      'image_url': imageUrl,
      'category_id': categoryId,
      'vendor_id': vendorId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Product copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    int? stock,
    bool? available,
    String? imageUrl,
    String? categoryId,
    String? vendorId,
    String? categoryName,
    String? vendorName,
    DateTime? createdAt,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      stock: stock ?? this.stock,
      available: available ?? this.available,
      imageUrl: imageUrl ?? this.imageUrl,
      categoryId: categoryId ?? this.categoryId,
      vendorId: vendorId ?? this.vendorId,
      categoryName: categoryName ?? this.categoryName,
      vendorName: vendorName ?? this.vendorName,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
