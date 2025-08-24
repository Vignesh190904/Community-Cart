class ChatbotOption {
  final String id;
  final String text;

  ChatbotOption({
    required this.id,
    required this.text,
  });

  factory ChatbotOption.fromJson(Map<String, dynamic> json) {
    return ChatbotOption(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
    };
  }
}

class ChatbotMessage {
  final String message;
  final List<ChatbotOption> options;
  final String? sessionId;
  final String? timestamp;
  final bool isUserMessage;

  ChatbotMessage({
    required this.message,
    required this.options,
    this.sessionId,
    this.timestamp,
    this.isUserMessage = false,
  });

  factory ChatbotMessage.fromJson(Map<String, dynamic> json) {
    return ChatbotMessage(
      message: json['message'] ?? '',
      options: (json['options'] as List<dynamic>?)
          ?.map((option) => ChatbotOption.fromJson(option))
          .toList() ?? [],
      sessionId: json['session_id'],
      timestamp: json['timestamp'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'options': options.map((option) => option.toJson()).toList(),
      'session_id': sessionId,
      'timestamp': timestamp,
    };
  }

  factory ChatbotMessage.userMessage(String message) {
    return ChatbotMessage(
      message: message,
      options: [],
      isUserMessage: true,
      timestamp: DateTime.now().toIso8601String(),
    );
  }
}
