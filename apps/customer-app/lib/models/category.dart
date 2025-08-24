class Category {
  final String id;
  final String name;
  final String communityId;
  final DateTime createdAt;

  Category({
    required this.id,
    required this.name,
    required this.communityId,
    required this.createdAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      communityId: json['community_id'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'community_id': communityId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Category copyWith({
    String? id,
    String? name,
    String? communityId,
    DateTime? createdAt,
  }) {
    return Category(
      id: id ?? this.id,
      name: name ?? this.name,
      communityId: communityId ?? this.communityId,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
