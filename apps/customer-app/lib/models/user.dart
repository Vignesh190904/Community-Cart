class User {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? block;
  final String? flat;
  final String? communityId;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.block,
    this.flat,
    this.communityId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      block: json['block'],
      flat: json['flat'],
      communityId: json['community_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'block': block,
      'flat': flat,
      'community_id': communityId,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? block,
    String? flat,
    String? communityId,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      block: block ?? this.block,
      flat: flat ?? this.flat,
      communityId: communityId ?? this.communityId,
    );
  }
}
