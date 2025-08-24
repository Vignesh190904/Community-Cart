import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:community_cart_customer/utils/constants.dart';
import 'package:community_cart_customer/models/user.dart';
import 'package:community_cart_customer/models/product.dart';
import 'package:community_cart_customer/models/category.dart';
import 'package:community_cart_customer/models/chatbot_message.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final String baseUrl = AppConstants.baseUrl;
  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  // Authentication APIs
  Future<Map<String, dynamic>> signup({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? block,
    String? flat,
    String? communityId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl${AppConstants.authSignup}'),
        headers: _headers,
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
          'block': block,
          'flat': flat,
          'community_id': communityId ?? AppConstants.defaultCommunityId,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Signup failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl${AppConstants.authLogin}'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Product APIs
  Future<List<Product>> getProducts({
    String? categoryId,
    String? vendorId,
    String? communityId,
    String? search,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = {
        'community_id': communityId ?? AppConstants.defaultCommunityId,
        'page': page.toString(),
        'limit': limit.toString(),
      };

      if (categoryId != null) queryParams['category_id'] = categoryId;
      if (vendorId != null) queryParams['vendor_id'] = vendorId;
      if (search != null) queryParams['search'] = search;

      final uri = Uri.parse('$baseUrl${AppConstants.products}').replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final products = (data['products'] as List)
            .map((product) => Product.fromJson(product))
            .toList();
        return products;
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<List<Category>> getCategories({String? communityId}) async {
    try {
      final queryParams = {
        'community_id': communityId ?? AppConstants.defaultCommunityId,
      };

      final uri = Uri.parse('$baseUrl${AppConstants.categories}').replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final categories = (data['categories'] as List)
            .map((category) => Category.fromJson(category))
            .toList();
        return categories;
      } else {
        throw Exception('Failed to load categories');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Order APIs
  Future<Map<String, dynamic>> createOrder({
    required String vendorId,
    required List<Map<String, dynamic>> items,
    String? deliveryAddress,
    String? deliveryInstructions,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl${AppConstants.orders}'),
        headers: _headers,
        body: jsonEncode({
          'vendor_id': vendorId,
          'items': items,
          'delivery_address': deliveryAddress,
          'delivery_instructions': deliveryInstructions,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Order creation failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // Chatbot APIs
  Future<ChatbotMessage> sendChatbotMessage({
    required String message,
    String? customerId,
    String? sessionId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl${AppConstants.chatbotMessage}'),
        headers: _headers,
        body: jsonEncode({
          'message': message,
          'customer_id': customerId,
          'session_id': sessionId,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ChatbotMessage.fromJson(data);
      } else {
        throw Exception('Failed to send message');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
