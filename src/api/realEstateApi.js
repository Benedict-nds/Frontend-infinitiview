const API_BASE_URL = 'https://oxhbyt3qak.execute-api.us-east-1.amazonaws.com/prod';

export class RealEstateAPI {
  static async askQuestion(question) {
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle Lambda response format where body is a JSON string
      if (data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          console.log('Parsed body:', parsedBody); // Debug log
          return parsedBody;
        } catch (error) {
          console.error('Error parsing response body:', error);
          return data;
        }
      }
      
      console.log('Returning data directly:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }

  static async getProperties() {
    try {
      const response = await this.askQuestion('What properties do you have?');
      return response;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  static async searchProperties(query) {
    try {
      const response = await this.askQuestion(query);
      return response;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  static async getVirtualTours() {
    try {
      const response = await this.askQuestion('Do you have any virtual tours available?');
      return response;
    } catch (error) {
      console.error('Error getting virtual tours:', error);
      throw error;
    }
  }
}
