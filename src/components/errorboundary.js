import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("❌ ErrorBoundary Hata:", error);
    console.log("ℹ️ Hata bilgisi:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#dc3545', marginBottom: 20 }}>
            Bir şeyler ters gitti
          </Text>
          
          <Text style={{ fontSize: 16, color: '#6c757d', textAlign: 'center', marginBottom: 30 }}>
            Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen tekrar deneyin.
          </Text>
          
          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              backgroundColor: '#007bff',
              paddingHorizontal: 30,
              paddingVertical: 15,
              borderRadius: 8,
              marginBottom: 20
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Tekrar Dene
            </Text>
          </TouchableOpacity>
          
          {__DEV__ && this.state.error && (
            <ScrollView style={{ maxHeight: 200, backgroundColor: '#f8f9fa', padding: 10, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#6c757d', fontFamily: 'monospace' }}>
                Hata: {this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text style={{ fontSize: 12, color: '#6c757d', fontFamily: 'monospace', marginTop: 10 }}>
                  Stack: {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
