<template>
  <div class="container">
    <h2>Shorten URL - Drive lah</h2>
    <form @submit.prevent="shortenUrl" class="form">
      <label for="url">Enter URL:</label>
      <input
          type="text"
          v-model="originalUrl"
          id="url"
          required
          placeholder="https://example.com"
          :class="{ invalid: urlError }"
      />
      <span v-if="urlError" class="error">{{ urlError }}</span>

      <label for="customAlias">Custom Alias (optional):</label>
      <input
          type="text"
          v-model="customAlias"
          id="customAlias"
          placeholder="e.g., mycustomalias"
          :class="{ invalid: aliasError }"
      />
      <span v-if="aliasError" class="error">{{ aliasError }}</span>

      <label for="expiration">Set Expiration (optional):</label>
      <input type="datetime-local" v-model="expiration" id="expiration" />

      <button type="submit" class="submit-button">Shorten URL</button>
    </form>
    <div v-if="shortUrl" class="result">
      <p>Shortened URL:</p>
      <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      originalUrl: '',
      customAlias: '',
      expiration: '',
      shortUrl: '',
      urlError: '',
      aliasError: '',
    };
  },
  methods: {
    validateUrl(url) {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
      return urlPattern.test(url);
    },
    async shortenUrl() {
      // Reset errors
      this.urlError = '';
      this.aliasError = '';

      // URL validation
      if (!this.validateUrl(this.originalUrl)) {
        alert('Please enter a valid URL.');
        return;
      }

      try {
        const response = await this.$http.post('/url/shorten', {
          originalUrl: this.originalUrl,
          customAlias: this.customAlias || null,
          expiration: this.expiration ? new Date(this.expiration).toISOString() : null,
        });
        this.shortUrl = response.data.shortUrl;
      } catch (error) {
        // Handle specific error codes
        if (error.response) {
          if (error.response.status === 409) {
            alert('The custom alias already exists. Please choose another one.');
          } else if (error.response.status === 429) {
            alert("You have reached the rate limit. Please try again later.");
          } else {
            alert("An error occurred. Please try again.");
          }
        } else {
          console.error("Error shortening URL:", error);
          alert("An unexpected error occurred. Please check your internet connection and try again.");
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

input[type="text"],
input[type="datetime-local"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 16px;
}

input.invalid {
  border-color: #e74c3c; /* Red border for invalid inputs */
}

.error {
  color: #e74c3c; /* Red color for error messages */
  font-size: 13px;
  margin-bottom: 12px;
}

input:focus {
  border-color: #007BFF;
  outline: none;
}

.submit-button {
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.result {
  text-align: center;
  margin-top: 20px;
}

.result a {
  color: #007BFF;
  font-weight: bold;
  text-decoration: none;
}

.result a:hover {
  text-decoration: underline;
}
</style>
