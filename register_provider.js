const axios = require('axios');

async function registerProvider() {
    try {
        const response = await axios.post('http://localhost:3001/auth/register', {
            email: "ai_provider@matchos.com",
            password: "password123",
            role: "provider",
            skills: ["python", "ai", "machine learning", "data science"]
        });
        console.log('Provider registered successfully:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Registration failed:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

registerProvider();
